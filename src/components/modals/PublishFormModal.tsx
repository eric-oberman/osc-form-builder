import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LinkIcon,
  ClipboardDocumentIcon,
  DocumentArrowDownIcon,
  CheckIcon,
  XMarkIcon,
  ShareIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline'

import { Button, Card, CardContent, Input, Checkbox } from '@/components/ui'
import type { Form } from '@/types'

interface PublishFormModalProps {
  form: Form
  isOpen: boolean
  onClose: () => void
  onPublish: (options: PublishOptions) => Promise<void>
}

export interface PublishOptions {
  generatePDF: boolean
  shareableLink: boolean
  qrCode: boolean
  allowPublicSubmissions: boolean
  embedCode: boolean
}

export function PublishFormModal({ form, isOpen, onClose, onPublish }: PublishFormModalProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishComplete, setPublishComplete] = useState(false)
  const [shareableUrl, setShareableUrl] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [publishOptions, setPublishOptions] = useState<PublishOptions>({
    generatePDF: false,
    shareableLink: true,
    qrCode: false,
    allowPublicSubmissions: true,
    embedCode: false
  })

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      await onPublish(publishOptions)

      // Generate mock URLs for demo
      if (publishOptions.shareableLink) {
        const mockUrl = `https://forms.osc.ny.gov/f/${form.id}/${generateShortId()}`
        setShareableUrl(mockUrl)
      }

      if (publishOptions.qrCode) {
        // In real app, this would generate a QR code
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareableUrl || `https://forms.osc.ny.gov/f/${form.id}`)}`
        setQrCodeUrl(qrUrl)
      }

      setPublishComplete(true)
    } catch (error) {
      console.error('Publishing failed:', error)
    } finally {
      setIsPublishing(false)
    }
  }

  const generateShortId = () => {
    return Math.random().toString(36).substring(2, 8)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const generateEmbedCode = () => {
    return `<iframe src="${shareableUrl}" width="100%" height="600" frameborder="0"></iframe>`
  }

  const downloadPDF = () => {
    // Mock PDF download - in real app this would generate and download actual PDF
    const link = document.createElement('a')
    link.href = '#'
    link.download = `${form.title.replace(/\s+/g, '_')}_fillable.pdf`
    link.click()

    // Show success message
    alert('PDF download started! In a real implementation, this would generate a fillable PDF of your form.')
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white dark:bg-osc-navy-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-osc-navy-200 dark:border-osc-navy-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShareIcon className="w-6 h-6 text-osc-blue-600" />
              <h2 className="text-xl font-semibold text-osc-navy-900 dark:text-osc-navy-100">
                {publishComplete ? 'Form Published!' : 'Publish Form'}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <XMarkIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {!publishComplete ? (
            <>
              {/* Form Info */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium text-osc-navy-900 dark:text-osc-navy-100 mb-2">
                    {form.title}
                  </h3>
                  <p className="text-sm text-osc-navy-600 dark:text-osc-navy-400">
                    {form.description || 'No description provided'}
                  </p>
                </CardContent>
              </Card>

              {/* Publishing Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-osc-navy-900 dark:text-osc-navy-100">
                  Publishing Options
                </h3>

                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <Checkbox
                      checked={publishOptions.shareableLink}
                      onChange={(e) => setPublishOptions({ ...publishOptions, shareableLink: e.target.checked })}
                    />
                    <div>
                      <div className="font-medium text-osc-navy-900 dark:text-osc-navy-100">
                        Generate Shareable Link
                      </div>
                      <div className="text-sm text-osc-navy-600 dark:text-osc-navy-400">
                        Create a public URL that can be shared with respondents
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <Checkbox
                      checked={publishOptions.generatePDF}
                      onChange={(e) => setPublishOptions({ ...publishOptions, generatePDF: e.target.checked })}
                    />
                    <div>
                      <div className="font-medium text-osc-navy-900 dark:text-osc-navy-100">
                        Generate Fillable PDF
                      </div>
                      <div className="text-sm text-osc-navy-600 dark:text-osc-navy-400">
                        Create a downloadable PDF version of the form
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <Checkbox
                      checked={publishOptions.qrCode}
                      onChange={(e) => setPublishOptions({ ...publishOptions, qrCode: e.target.checked })}
                    />
                    <div>
                      <div className="font-medium text-osc-navy-900 dark:text-osc-navy-100">
                        Generate QR Code
                      </div>
                      <div className="text-sm text-osc-navy-600 dark:text-osc-navy-400">
                        Create a QR code for easy mobile access
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <Checkbox
                      checked={publishOptions.allowPublicSubmissions}
                      onChange={(e) => setPublishOptions({ ...publishOptions, allowPublicSubmissions: e.target.checked })}
                    />
                    <div>
                      <div className="font-medium text-osc-navy-900 dark:text-osc-navy-100">
                        Allow Public Submissions
                      </div>
                      <div className="text-sm text-osc-navy-600 dark:text-osc-navy-400">
                        Allow anyone with the link to submit responses
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <Checkbox
                      checked={publishOptions.embedCode}
                      onChange={(e) => setPublishOptions({ ...publishOptions, embedCode: e.target.checked })}
                    />
                    <div>
                      <div className="font-medium text-osc-navy-900 dark:text-osc-navy-100">
                        Generate Embed Code
                      </div>
                      <div className="text-sm text-osc-navy-600 dark:text-osc-navy-400">
                        Create HTML code to embed the form in websites
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </>
          ) : (
            /* Published Results */
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-osc-navy-900 dark:text-osc-navy-100 mb-2">
                  Form Successfully Published!
                </h3>
                <p className="text-osc-navy-600 dark:text-osc-navy-400">
                  Your form is now live and ready to receive submissions.
                </p>
              </div>

              {/* Shareable Link */}
              {publishOptions.shareableLink && shareableUrl && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <LinkIcon className="w-5 h-5 text-osc-blue-600" />
                      <h4 className="font-medium text-osc-navy-900 dark:text-osc-navy-100">
                        Shareable Link
                      </h4>
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        value={shareableUrl}
                        readOnly
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(shareableUrl)}
                        className="flex items-center space-x-2"
                      >
                        <ClipboardDocumentIcon className="w-4 h-4" />
                        <span>{linkCopied ? 'Copied!' : 'Copy'}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* QR Code */}
              {publishOptions.qrCode && qrCodeUrl && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <QrCodeIcon className="w-5 h-5 text-osc-blue-600" />
                      <h4 className="font-medium text-osc-navy-900 dark:text-osc-navy-100">
                        QR Code
                      </h4>
                    </div>
                    <div className="flex justify-center">
                      <img
                        src={qrCodeUrl}
                        alt="Form QR Code"
                        className="border border-osc-navy-200 rounded"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Embed Code */}
              {publishOptions.embedCode && shareableUrl && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <LinkIcon className="w-5 h-5 text-osc-blue-600" />
                      <h4 className="font-medium text-osc-navy-900 dark:text-osc-navy-100">
                        Embed Code
                      </h4>
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        value={generateEmbedCode()}
                        readOnly
                        className="flex-1 text-xs"
                      />
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(generateEmbedCode())}
                        className="flex items-center space-x-2"
                      >
                        <ClipboardDocumentIcon className="w-4 h-4" />
                        <span>Copy</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* PDF Download */}
              {publishOptions.generatePDF && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DocumentArrowDownIcon className="w-5 h-5 text-osc-blue-600" />
                        <h4 className="font-medium text-osc-navy-900 dark:text-osc-navy-100">
                          Fillable PDF
                        </h4>
                      </div>
                      <Button
                        variant="outline"
                        onClick={downloadPDF}
                        className="flex items-center space-x-2"
                      >
                        <DocumentArrowDownIcon className="w-4 h-4" />
                        <span>Download PDF</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-osc-navy-200 dark:border-osc-navy-700 flex justify-end space-x-3">
          {!publishComplete ? (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isPublishing}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePublish}
                loading={isPublishing}
                disabled={isPublishing}
                className="bg-osc-blue-600 hover:bg-osc-blue-700"
              >
                Publish Form
              </Button>
            </>
          ) : (
            <Button
              onClick={onClose}
              className="bg-osc-blue-600 hover:bg-osc-blue-700"
            >
              Done
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}