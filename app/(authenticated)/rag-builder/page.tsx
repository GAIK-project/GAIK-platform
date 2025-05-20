"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { XCircle } from "lucide-react";
import AutoGrowingTextarea from "@/components/ragbuilder/AutoTextArea";
import { useRouter } from "next/navigation";
import useStore from "@/app/utils/store/useStore";
import { saveCustomModel, saveModelId } from "../chatbot/actions";
import { sanitizeTableName } from "@/app/utils/functions/functions";
// import FileUpload from "@/components/ragbuilder/FIleUpload";
import FileUpload from "@/components/ragbuilder/FIleUpload2";
import "@/app/styles/ragbuilder.css";
import InfoBox from "@/components/ragbuilder/InfoBox";

export default function Home() {
    const [assistantName, setAssistantName] = useState<string>("");
    const [persistantAssistantName, setPersistantAssistantName] = useState<string>("");
    const [systemPrompt, setSystemPrompt] = useState<string>("");
    const [links, setLinks] = useState<string[]>([]);
    const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [processCompleted, setProcessCompleted] = useState<boolean>(false);
    const [progressPercent, setProgressPercent] = useState<number>(0);
    const [files, setFiles] = useState<File[]>([]);
    const [username, setUsername] = useState<string>("jaakko");
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'none'>('none');
    const [message, setMessage] = useState<string>('');

    const router = useRouter();

    const { setBaseModel, setCustomModel } = useStore();

    useEffect(() => {
        if (files.length > 0) {
          validateForm(systemPrompt, links);
        }
      }, [files]);  // Run validation every time 'files' changes

    const scrollToBottom = () => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth', // or 'auto'
        });
    };

    const handleSystemPromptChange = (e : any) => {
        setSystemPrompt(e.target.value);
        validateForm(e.target.value, links);
    };

    const handleLinkChange = (index : number, value : string) => {
        const updatedLinks = [...links];
        updatedLinks[index] = value;
        setLinks(updatedLinks);
        validateForm(systemPrompt, updatedLinks);
    };

    const handleNameChange = (value : string) => {
        setAssistantName(value);
        validateForm(systemPrompt, links);
    };

    const addLinkField = () => {
        if(links.length > 4){
            setErrorMessage("You can add maximum of 5 links");
        }
        else {
            setLinks([...links, ""]);
        }  
    };

    const validateAfterFileChange = () => {
        validateForm(systemPrompt, links);
    }

    const validateForm = (prompt : string, linksArray : string[]) => {
        // console.log(files);
        if (assistantName.trim() === "") {
            setErrorMessage("Name for the assistant cannot be empty.");
            setIsButtonEnabled(false);
            return false;
        }

        if (prompt.trim() === "") {
            setErrorMessage("Instructions for the assistant cannot be empty.");
            setIsButtonEnabled(false);
            return false;
        }

        
        if(links.length === 0 && files.length === 0){
            setErrorMessage("Add at least 1 link or file");
            setIsButtonEnabled(false);
            return false;
        }
      
        if(links.length > 0){
            for (let i = 0; i < linksArray.length; i++) {
                if (linksArray[i].trim() === "") {
                    setErrorMessage(`Link ${i + 1} cannot be empty.`);
                    setIsButtonEnabled(false);
                    return false;
                }
                if (!/^https?:\/\/.+/.test(linksArray[i])) {
                    setErrorMessage(`Link ${i + 1} must start with "http://" or "https://".`);
                    setIsButtonEnabled(false);
                    return false;
                }
            }
        }
        
        setErrorMessage(""); // Clear error message if everything is valid
        setIsButtonEnabled(true);
        return true;
    };

    const handleSubmit = async () => {
        setStatus('loading');
        scrollToBottom();
        let check : boolean =  await checkUniqueName(assistantName);
        if(check){
            setErrorMessage("Assistant name already exists, please select a new one");
            return;
        }
        let validationCheck : boolean = validateForm(systemPrompt, links);
        if(!validationCheck){
            return;
        }

        let user = await getUserFromServer();
        let owner = "jaakko";
        if(user){
            owner = user;
        }

        const payload = {
            assistantName,
            systemPrompt,
            links,
            owner
        };

        // setLoading(true);
        // setIsButtonEnabled(false);

        try {

            const formData = new FormData();

            // Append JSON data as a single blob
            formData.append("data", JSON.stringify(payload));
        
            // Append files 
            files.forEach((file, index) => {
                formData.append("files", file);
            });

            const response = await fetch("/api/setupRag", {
                method: "POST",
                body: formData, //add formdata here
            });

            console.log("json: ", response.json);

            if (response.ok) {
                setStatus('success');
                let newAssistantName : string = sanitizeTableName(assistantName);
                setPersistantAssistantName(newAssistantName);
            } else {
                console.error("Failed to send data.");
                setStatus('error');
            }
        } catch (error) {
            console.error("Error occurred while sending data:", error);
        }
    };

    const checkUniqueName = async (name: string) => {
        const res = await fetch('/api/checkAssistantName', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assistantName: name }),
        });
      
        const data = await res.json();
        return data.isTaken;
    };

    const getUserFromServer = async () => {
        try {
            const res = await fetch('/api/getUserFromServer');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            return data.email;
          } catch (err) {
            console.error('Error:', err);
            return false;
          }
    }

    async function redirectToChat() {
        await saveModelId("hyde-rag");
        
        await saveCustomModel(persistantAssistantName);
        setBaseModel("hyde-rag");
        setCustomModel(persistantAssistantName);
        router.push('/chatbot');
    }

    const handleRetry = () => {
        window.location.reload();
    };
    
    const handleNext = () => {
        router.push('/datasetmanager');
    };

    return (
        <div className="container">
            <Head>
                <title>Create dataset</title>
            </Head>
            <div className="welcome-section faded-shadow">
                <div className="welcome-text">Create your own AI dataset</div>
                <div className="welcome-subtitle">
                    Here you can add custom data from weblinks or files as context, so that we can build a RAG asssistant to fetch answers from the given context!
                </div>
            </div>

            <div className="section">
                    <h2 className="titles">Name for your new dataset</h2>
                    <input 
                        className="input"
                        type="text"
                        maxLength={30}
                        value={assistantName}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="Formulasensei" 
                    />
                </div>

            <div className="centered-section">
                <div className="section">
                    <h2 className="titles">Instructions (system prompt)</h2>
                    <AutoGrowingTextarea value={systemPrompt} onChange={handleSystemPromptChange} placeholder='You are an AI assistant who knows everything about Formula One.'/>
                </div>

                <div className="section">
                    <h2 className="titles">Context from the web</h2>
                    {links.map((link, index) => (
                        <div key={index} className="link-field-container">
                            <input
                                className="input"
                                type="text"
                                maxLength={300}
                                value={link}
                                onChange={(e) => handleLinkChange(index, e.target.value)}
                                placeholder={(index === 0) ? 'https://en.wikipedia.org/wiki/Formula_One' : `Link ${index + 1}`}
                            />
                            <button
                                className="delete-button"
                                onClick={() => {
                                    const updatedLinks = links.filter((_, i) => i !== index);
                                    setLinks(updatedLinks);
                                    validateForm(systemPrompt, updatedLinks);
                                }}
                            >
                            X
                            </button>
                        </div>
                    ))}
                    <button className="add-button" onClick={addLinkField}>
                        Add Another Link
                    </button>
                </div>

                <div className="section">
                    <h2 className="titles">Context from files</h2>
                    {/* <FileUpload/> */}
                    <FileUpload files={files} setFiles={setFiles} runValidation={validateAfterFileChange}/>
                </div>

                {errorMessage && <div style={{display: "flex", flexDirection: 'row'}}>
                                    <div className="error-message">
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <XCircle size={24} color="red" style={{ marginRight: '8px' }}/>
                                        <span>{errorMessage}</span>
                                        </div>
                                    </div>
                                 </div>
                }

                <div className="status-container">
                    {status === 'none' && (
                        <>
                        </>
                    )}
                    {status === 'loading' && (
                        <>
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-lg">Processing...</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                        <p className="text-green-600 text-lg mb-4">{message} Go to dataset manager here to see the progress on your datasets.</p>
                        <button
                            onClick={handleNext}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Next
                        </button>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                        <p className="text-red-600 text-lg mb-4">{message} Reload the page here or try again later.</p>
                        <button
                            onClick={handleRetry}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Retry
                        </button>
                        </>
                    )}
                </div>

                <InfoBox/>

                <div className="button-container">
                    <button
                        className="create-button"
                        disabled={!isButtonEnabled}
                        onClick={handleSubmit}
                    >
                        Create Your Own RAG Model dataset
                    </button>
                </div>

            </div>
        </div>
    );
}
