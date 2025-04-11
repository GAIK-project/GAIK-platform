'use client'

import React, { useState } from 'react'
import styles from '@/app/styles/FileUpload.module.css'

const MAX_TOTAL_SIZE = 200 * 1024 * 1024 // 200 MB

const FileUpload = () => {
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)

  const getTotalSize = (fileList: File[]) =>
    fileList.reduce((acc, file) => acc + file.size, 0)

  const updateFiles = (newFiles: File[]) => {
    const updated = [...files, ...newFiles]
    const totalSize = getTotalSize(updated)

    if (totalSize > MAX_TOTAL_SIZE) {
      setError('Total file size exceeds 200 MB limit.')
    } else {
      setFiles(updated)
      setError(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    updateFiles(droppedFiles)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    updateFiles(selectedFiles)
  }

  const handleRemoveFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index)
    setFiles(updated)

    if (getTotalSize(updated) <= MAX_TOTAL_SIZE) {
      setError(null)
    }
  }

  const handleSubmit = async () => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const result = await res.json()
    console.log(result)
  }

  const formatSize = (bytes: number) =>
    `${(bytes / 1024 / 1024).toFixed(2)} MB`

  return (
    <div className={styles.container}>
      <h2>Upload Files</h2>
      <p className={styles.infoText}>Supported file types: PDF, JPG, PNG, EXCEL, WORD, TXT</p>
      <p className={styles.infoText}>Max total file size: 200 MB</p>

      <div
        className={styles.dropzone}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
      >
        <p>Drag and drop files here</p>
        <input
          type="file"
          multiple
          className={styles.fileInput}
          onChange={handleFileChange}
        />
      </div>

      <ul className={styles.fileList}>
        {files.map((file, i) => (
          <li key={i} className={styles.fileItem}>
            {file.name} ({formatSize(file.size)})
            <button
              className={styles.removeButton}
              onClick={() => handleRemoveFile(i)}
              aria-label={`Remove ${file.name}`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {files.length > 0 && (
        <p className={styles.totalSize}>
          Total size: {formatSize(getTotalSize(files))}
        </p>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <button
        className={styles.button}
        onClick={handleSubmit}
        disabled={files.length === 0 || !!error}
      >
        Upload
      </button>
    </div>
  )
}

export default FileUpload
