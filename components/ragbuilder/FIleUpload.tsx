'use client'

import React, { useState } from 'react'
import styles from '@/app/styles/FileUpload.module.css'

const FileUpload = () => {
  const [files, setFiles] = useState<File[]>([])

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles(prev => [...prev, ...droppedFiles])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...selectedFiles])
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

  return (
    <div className={styles.container}>
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
      <ul>
        {files.map((file, i) => (
          <li key={i}>{file.name}</li>
        ))}
      </ul>
      <button className={styles.button} onClick={handleSubmit}>
        Upload
      </button>
    </div>
  )
}

export default FileUpload
