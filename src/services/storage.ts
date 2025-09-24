/**
 * Advanced LocalStorage abstraction layer with query capabilities
 * Provides a database-like interface for client-side data management
 */

import { compress, decompress } from 'lz-string'

// Storage configuration
interface StorageConfig {
  prefix: string
  compression: boolean
  encryption: boolean
  maxSize: number // in MB
  version: string
}

// Query operators
type QueryOperator =
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'less_than'
  | 'greater_than_or_equal'
  | 'less_than_or_equal'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'in'
  | 'not_in'

// Query condition
interface QueryCondition<T = any> {
  field: keyof T
  operator: QueryOperator
  value: any
}

// Query builder
interface Query<T = any> {
  where?: QueryCondition<T>[]
  orderBy?: {
    field: keyof T
    direction: 'asc' | 'desc'
  }[]
  limit?: number
  offset?: number
}

// Storage result
interface StorageResult<T> {
  data: T[]
  total: number
  hasMore: boolean
}

// Collection metadata
interface CollectionMeta {
  name: string
  count: number
  lastModified: string
  indices: string[]
  version: string
}

class StorageManager {
  private config: StorageConfig
  private collections: Map<string, CollectionMeta> = new Map()

  constructor(config: Partial<StorageConfig> = {}) {
    this.config = {
      prefix: 'osc_form_builder',
      compression: true,
      encryption: false,
      maxSize: 50, // 50MB
      version: '1.0.0',
      ...config
    }
    this.loadCollectionMetadata()
  }

  // Collection management
  private getCollectionKey(collection: string): string {
    return `${this.config.prefix}_collection_${collection}`
  }

  private getMetaKey(collection: string): string {
    return `${this.config.prefix}_meta_${collection}`
  }

  private getIndexKey(collection: string, field: string): string {
    return `${this.config.prefix}_index_${collection}_${field}`
  }

  private loadCollectionMetadata(): void {
    const keys = this.getStorageKeys().filter(key =>
      key.startsWith(`${this.config.prefix}_meta_`)
    )

    keys.forEach(key => {
      const metaData = this.getFromStorage(key)
      if (metaData) {
        const collectionName = key.replace(`${this.config.prefix}_meta_`, '')
        this.collections.set(collectionName, metaData)
      }
    })
  }

  private saveCollectionMetadata(collection: string, meta: CollectionMeta): void {
    this.setToStorage(this.getMetaKey(collection), meta)
    this.collections.set(collection, meta)
  }

  // Storage utilities
  private getStorageKeys(): string[] {
    return Object.keys(localStorage)
  }

  private getFromStorage<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      if (!item) return null

      let data = item
      if (this.config.compression) {
        data = decompress(item) || item
      }

      return JSON.parse(data)
    } catch (error) {
      console.error(`Error reading from storage: ${key}`, error)
      return null
    }
  }

  private setToStorage<T>(key: string, value: T): void {
    try {
      let data = JSON.stringify(value)

      if (this.config.compression) {
        data = compress(data)
      }

      localStorage.setItem(key, data)
    } catch (error) {
      console.error(`Error writing to storage: ${key}`, error)
      throw new Error(`Storage write failed: ${error}`)
    }
  }

  private removeFromStorage(key: string): void {
    localStorage.removeItem(key)
  }

  // CRUD Operations
  async create<T extends Record<string, any>>(
    collection: string,
    data: T[]
  ): Promise<T[]> {
    const collectionKey = this.getCollectionKey(collection)
    const existingData = this.getFromStorage<T[]>(collectionKey) || []

    const timestamp = new Date().toISOString()
    const newData = data.map(item => ({
      ...item,
      id: item.id || this.generateId(),
      createdAt: item.createdAt || timestamp,
      updatedAt: timestamp
    }))

    const updatedData = [...existingData, ...newData]
    this.setToStorage(collectionKey, updatedData)

    // Update metadata
    this.updateCollectionMetadata(collection, updatedData.length)

    // Update indices
    this.updateIndices(collection, newData)

    return newData
  }

  async read<T>(
    collection: string,
    query: Query<T> = {}
  ): Promise<StorageResult<T>> {
    const collectionKey = this.getCollectionKey(collection)
    const data = this.getFromStorage<T[]>(collectionKey) || []

    let filteredData = data
    let total = data.length

    // Apply where conditions
    if (query.where && query.where.length > 0) {
      filteredData = this.applyWhereConditions(data, query.where)
    }

    // Apply ordering
    if (query.orderBy && query.orderBy.length > 0) {
      filteredData = this.applySorting(filteredData, query.orderBy)
    }

    total = filteredData.length

    // Apply pagination
    const offset = query.offset || 0
    const limit = query.limit || filteredData.length
    const paginatedData = filteredData.slice(offset, offset + limit)

    return {
      data: paginatedData,
      total,
      hasMore: offset + limit < filteredData.length
    }
  }

  async update<T extends Record<string, any>>(
    collection: string,
    query: Query<T>,
    updates: Partial<T>
  ): Promise<number> {
    const collectionKey = this.getCollectionKey(collection)
    const data = this.getFromStorage<T[]>(collectionKey) || []

    let updatedCount = 0
    const timestamp = new Date().toISOString()

    const updatedData = data.map(item => {
      if (this.matchesQuery(item, query.where || [])) {
        updatedCount++
        return {
          ...item,
          ...updates,
          updatedAt: timestamp
        }
      }
      return item
    })

    if (updatedCount > 0) {
      this.setToStorage(collectionKey, updatedData)
      this.updateCollectionMetadata(collection, updatedData.length)
    }

    return updatedCount
  }

  async delete<T>(
    collection: string,
    query: Query<T>
  ): Promise<number> {
    const collectionKey = this.getCollectionKey(collection)
    const data = this.getFromStorage<T[]>(collectionKey) || []

    const filteredData = data.filter(item =>
      !this.matchesQuery(item, query.where || [])
    )

    const deletedCount = data.length - filteredData.length

    if (deletedCount > 0) {
      this.setToStorage(collectionKey, filteredData)
      this.updateCollectionMetadata(collection, filteredData.length)
    }

    return deletedCount
  }

  // Query processing
  private applyWhereConditions<T>(data: T[], conditions: QueryCondition<T>[]): T[] {
    return data.filter(item => this.matchesQuery(item, conditions))
  }

  private matchesQuery<T>(item: T, conditions: QueryCondition<T>[]): boolean {
    return conditions.every(condition => this.evaluateCondition(item, condition))
  }

  private evaluateCondition<T>(item: T, condition: QueryCondition<T>): boolean {
    const fieldValue = item[condition.field]
    const conditionValue = condition.value

    switch (condition.operator) {
      case 'equals':
        return fieldValue === conditionValue
      case 'not_equals':
        return fieldValue !== conditionValue
      case 'greater_than':
        return fieldValue > conditionValue
      case 'less_than':
        return fieldValue < conditionValue
      case 'greater_than_or_equal':
        return fieldValue >= conditionValue
      case 'less_than_or_equal':
        return fieldValue <= conditionValue
      case 'contains':
        return String(fieldValue).toLowerCase().includes(String(conditionValue).toLowerCase())
      case 'not_contains':
        return !String(fieldValue).toLowerCase().includes(String(conditionValue).toLowerCase())
      case 'starts_with':
        return String(fieldValue).toLowerCase().startsWith(String(conditionValue).toLowerCase())
      case 'ends_with':
        return String(fieldValue).toLowerCase().endsWith(String(conditionValue).toLowerCase())
      case 'in':
        return Array.isArray(conditionValue) && conditionValue.includes(fieldValue)
      case 'not_in':
        return Array.isArray(conditionValue) && !conditionValue.includes(fieldValue)
      default:
        return false
    }
  }

  private applySorting<T>(data: T[], orderBy: Query<T>['orderBy']): T[] {
    if (!orderBy || orderBy.length === 0) return data

    return [...data].sort((a, b) => {
      for (const sort of orderBy) {
        const aValue = a[sort.field]
        const bValue = b[sort.field]

        let comparison = 0
        if (aValue < bValue) comparison = -1
        if (aValue > bValue) comparison = 1

        if (comparison !== 0) {
          return sort.direction === 'desc' ? -comparison : comparison
        }
      }
      return 0
    })
  }

  // Index management
  private updateIndices<T extends Record<string, any>>(collection: string, data: T[]): void {
    const meta = this.collections.get(collection)
    if (!meta || !meta.indices.length) return

    meta.indices.forEach(field => {
      const indexKey = this.getIndexKey(collection, field)
      const existingIndex = this.getFromStorage<Record<any, string[]>>(indexKey) || {}

      data.forEach(item => {
        const value = item[field]
        if (value !== undefined && value !== null) {
          if (!existingIndex[value]) {
            existingIndex[value] = []
          }
          if (!existingIndex[value].includes(item.id)) {
            existingIndex[value].push(item.id)
          }
        }
      })

      this.setToStorage(indexKey, existingIndex)
    })
  }

  // Utility methods
  private updateCollectionMetadata(collection: string, count: number): void {
    const meta: CollectionMeta = this.collections.get(collection) || {
      name: collection,
      count: 0,
      lastModified: new Date().toISOString(),
      indices: [],
      version: this.config.version
    }

    meta.count = count
    meta.lastModified = new Date().toISOString()

    this.saveCollectionMetadata(collection, meta)
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Collection operations
  async dropCollection(collection: string): Promise<void> {
    const collectionKey = this.getCollectionKey(collection)
    const metaKey = this.getMetaKey(collection)

    this.removeFromStorage(collectionKey)
    this.removeFromStorage(metaKey)
    this.collections.delete(collection)

    // Remove indices
    const meta = this.collections.get(collection)
    if (meta && meta.indices.length) {
      meta.indices.forEach(field => {
        this.removeFromStorage(this.getIndexKey(collection, field))
      })
    }
  }

  async createIndex(collection: string, field: string): Promise<void> {
    const meta = this.collections.get(collection) || {
      name: collection,
      count: 0,
      lastModified: new Date().toISOString(),
      indices: [],
      version: this.config.version
    }

    if (!meta.indices.includes(field)) {
      meta.indices.push(field)
      this.saveCollectionMetadata(collection, meta)

      // Build index for existing data
      const data = this.getFromStorage<any[]>(this.getCollectionKey(collection)) || []
      this.updateIndices(collection, data)
    }
  }

  // Statistics and maintenance
  getStorageStats(): {
    totalSize: number
    collections: CollectionMeta[]
    usage: number
  } {
    const collections = Array.from(this.collections.values())
    let totalSize = 0

    this.getStorageKeys().forEach(key => {
      if (key.startsWith(this.config.prefix)) {
        const value = localStorage.getItem(key)
        if (value) {
          totalSize += value.length
        }
      }
    })

    const maxSizeBytes = this.config.maxSize * 1024 * 1024
    const usage = totalSize / maxSizeBytes

    return {
      totalSize,
      collections,
      usage
    }
  }

  async clearAll(): Promise<void> {
    const keys = this.getStorageKeys().filter(key =>
      key.startsWith(this.config.prefix)
    )

    keys.forEach(key => this.removeFromStorage(key))
    this.collections.clear()
  }
}

// Create singleton instance
export const storage = new StorageManager()

// Query builder helper
export class QueryBuilder<T> {
  private query: Query<T> = {}

  where(field: keyof T, operator: QueryOperator, value: any): QueryBuilder<T> {
    if (!this.query.where) {
      this.query.where = []
    }
    this.query.where.push({ field, operator, value })
    return this
  }

  orderBy(field: keyof T, direction: 'asc' | 'desc' = 'asc'): QueryBuilder<T> {
    if (!this.query.orderBy) {
      this.query.orderBy = []
    }
    this.query.orderBy.push({ field, direction })
    return this
  }

  limit(count: number): QueryBuilder<T> {
    this.query.limit = count
    return this
  }

  offset(count: number): QueryBuilder<T> {
    this.query.offset = count
    return this
  }

  build(): Query<T> {
    return this.query
  }
}

// Helper function to create query builder
export function query<T>(): QueryBuilder<T> {
  return new QueryBuilder<T>()
}

// Export types for use in other modules
export type {
  Query,
  QueryCondition,
  QueryOperator,
  StorageResult,
  CollectionMeta
}