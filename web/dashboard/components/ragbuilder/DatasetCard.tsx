// import { Assistant } from "@/app/(authenticated)/datasetmanager/page";
// import styles from "@/app/styles/DatasetManager.module.css";
// import { useState } from "react";

// interface Props {
//   assistant: Assistant;
//   onEdit: (id: number, updatedData: Partial<Assistant>) => void;
//   onDelete: (id: number) => void;
// }

// export default function DatasetCard({ assistant, onEdit, onDelete }: Props) {
//   const [systemPrompt, setSystemPrompt] = useState(assistant.systemPrompt);
//   const [sources, setSources] = useState(assistant.originalSources);

//   const handleDeleteFile = (uniqueId: string) => {
//     setSources(sources.filter((source) => source.uniqueId !== uniqueId));
//   };

//   const handleEdit = () => {
//     onEdit(assistant.id, {
//       systemPrompt,
//       originalSources: sources,
//     });
//   };

//   return (
//     <div className={styles.card}>
//       <h2>{assistant.assistantName}</h2>
//       <p>
//         <strong>ID:</strong> {assistant.id}
//       </p>
//       <p>
//         <strong>Owner:</strong> {assistant.owner}
//       </p>
//       <p>
//         <strong>Chunks:</strong> {assistant.currentChunk} /{" "}
//         {assistant.totalChunks}
//       </p>
//       <p>
//         <strong>Created:</strong>{" "}
//         {new Date(assistant.createdAt).toLocaleString()}
//       </p>
//       <p>
//         <strong>Completed:</strong> {assistant.taskCompleted ? "Yes" : "No"}
//       </p>

//       <div className={styles.field}>
//         <label>System Prompt:</label>
//         <textarea
//           className={styles.textarea}
//           value={systemPrompt}
//           onChange={(e) => setSystemPrompt(e.target.value)}
//         />
//       </div>

//       <div className={styles.field}>
//         <label>Original Sources:</label>
//         <ul className={styles.sourceList}>
//           {sources.map((src) => (
//             <li key={src.uniqueId} className={styles.sourceItem}>
//               ...
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className={styles.actions}>
//         <button className={styles.button} onClick={handleEdit}>
//           Save Edits
//         </button>
//         <button
//           className={styles.button}
//           onClick={() => onDelete(assistant.id)}
//         >
//           Delete Dataset
//         </button>
//         <button
//           className={styles.button}
//           onClick={() => alert("This feature is coming soon")}
//         >
//           Add Data
//         </button>
//       </div>
//     </div>
//   );
// }
