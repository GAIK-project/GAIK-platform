// "use client"
// import DatasetCard from '@/components/ragbuilder/DatasetCard';
// import styles from '@/app/styles/DatasetManager.module.css';
// import { useEffect, useState } from "react";
// import { createBrowserClient } from '@/lib/db/supabase/client';

// export interface OriginalSource {
//     filename: string;
//     uniqueId: string;
//   }

//   export interface Assistant {
//     id: number;
//     assistantName: string;
//     owner: string;
//     originalSources: OriginalSource[];
//     errors: any;
//     systemPrompt: string;
//     currentChunk: number;
//     totalChunks: number;
//     createdAt: string;
//     taskCompleted: boolean;
//   }

// export default function DatasetManager() {
//   const [assistants, setAssistants] = useState<Assistant[]>([]);
//   const [owner, setOwner] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchData() {
//         const supabase = createBrowserClient();
//       const user = await getUserFromServer();
//       let currentOwner : string = "jaakko";
//       if(user){
//         currentOwner = user;
//       }
//       setOwner(currentOwner);
//       const { data, error } = await supabase
//         .from("assistants")
//         .select("*")
//         .eq("owner", currentOwner);

//       if (data) {
//         setAssistants(data as Assistant[]);
//       } else {
//         console.error(error);
//       }
//     }

//     fetchData();
//   }, []);

//   const handleEdit = (id: number, updatedData: Partial<Assistant>) => {
//     console.log("Edit ID:", id, updatedData);
//     // Hook up later with API
//   };

//   const handleDelete = (id: number) => {
//     console.log("Delete ID:", id);
//     // Hook up later with API
//   };

//   const getUserFromServer = async () => {
//     try {
//         const res = await fetch('/api/getUserFromServer');
//         if (!res.ok) throw new Error('Failed to fetch');
//         const data = await res.json();
//         return data.email;
//       } catch (err) {
//         console.error('Error:', err);
//         return false;
//       }
//   }

//   if (!owner) return <div>Loading...</div>;

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Dataset Manager</h1>

//       <div className={styles.grid}>
//         {assistants.map((assistant) => (
//           <DatasetCard
//             key={assistant.id}
//             assistant={assistant}
//             onEdit={handleEdit}
//             onDelete={handleDelete}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
