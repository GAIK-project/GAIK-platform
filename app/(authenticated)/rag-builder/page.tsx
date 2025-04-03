"use client";
import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { XCircle } from "lucide-react";
import AutoGrowingTextarea from "@/components/ragbuilder/AutoTextArea";
import { useRouter } from "next/navigation";
import useStore from "@/app/utils/store/useStore";
import { saveCustomModel, saveModelId } from "../chatbot/actions";
import { sanitizeTableName } from "@/app/utils/functions/functions";
import "@/app/styles/ragbuilder.css";

export default function Home() {
    const [assistantName, setAssistantName] = useState<string>("");
    const [persistantAssistantName, setPersistantAssistantName] = useState<string>("");
    const [systemPrompt, setSystemPrompt] = useState<string>("");
    const [links, setLinks] = useState<string[]>([""]);
    const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [processCompleted, setProcessCompleted] = useState<boolean>(false);
    const [progressPercent, setProgressPercent] = useState<number>(0);

    const router = useRouter();

    const { setBaseModel, setCustomModel } = useStore();

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
    };

    const addLinkField = () => {
        if(links.length > 4){
            setErrorMessage("You can add maximum of 5 links");
        }
        else {
            setLinks([...links, ""]);
        }  
    };

    const validateForm = (prompt : string, linksArray : string[]) => {

        if (assistantName.trim() === "") {
            setErrorMessage("Name for the assistant cannot be empty.");
            setIsButtonEnabled(false);
            return;
        }

        if (prompt.trim() === "") {
            setErrorMessage("Instructions for the assistant cannot be empty.");
            setIsButtonEnabled(false);
            return;
        }

        for (let i = 0; i < linksArray.length; i++) {
            if (linksArray[i].trim() === "") {
                setErrorMessage(`Link ${i + 1} cannot be empty.`);
                setIsButtonEnabled(false);
                return;
            }
            if (!/^https?:\/\/.+/.test(linksArray[i])) {
                setErrorMessage(`Link ${i + 1} must start with "http://" or "https://".`);
                setIsButtonEnabled(false);
                return;
            }
        }

        setErrorMessage(""); // Clear error message if everything is valid
        setIsButtonEnabled(true);
    };

    const handleSubmit = async () => {
        scrollToBottom();
        let check : boolean =  await checkUniqueName(assistantName);
        if(check){
            setErrorMessage("Assistant name already exists, please select a new one");
            return;
        }

        const payload = {
            assistantName,
            systemPrompt,
            links,
        };

        setLoading(true);
        setIsButtonEnabled(false);

        try {
            const response = await fetch("/api/setupRag", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                checkStatus();
                console.log("Data sent successfully!");
                let newAssistantName : string = sanitizeTableName(assistantName);
                setPersistantAssistantName(newAssistantName);
            } else {
                console.error("Failed to send data.");
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

    async function checkStatus() {
        const interval = setInterval(async () => {
            try {
                const res = await fetch('/api/checkTaskStatus', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ assistantName }),
                });
    
                if (!res.ok) {
                    console.error('Failed to fetch task status');
                    return;
                }
    
                const data = await res.json();
    
                setProgressPercent(data.percentageCompleted);
    
                setProcessCompleted(data.taskCompleted);
    
                if (data.taskCompleted) {
                    clearInterval(interval);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error while checking task status:', error);
            }
        }, 5000); // Poll every x seconds
    }

    async function testDb() {
        const res = await fetch(`/api/testDb`);
        const data = await res.json();
    }

    async function redirectToChat() {
        await saveModelId("hyde-rag");
        await saveCustomModel(persistantAssistantName);
        setBaseModel("hyde-rag");
        setCustomModel(persistantAssistantName);
        router.push('/chatbot');
    }

    return (
        <div className="container">
            <Head>
                <title>Create RAG Model</title>
            </Head>
            <div className="welcome-section faded-shadow">
                <div className="welcome-text">Create your own AI assistant</div>
                <div className="welcome-subtitle">
                    Define instructions for your assistant and add links as context, so the assistant can fetch answers from the given context!
                </div>
            </div>

            <div className="section">
                    <h2 className="titles">Name for your new assistant</h2>
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
                    <h2 className="titles">Links</h2>
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

                {errorMessage && <div style={{display: "flex", flexDirection: 'row'}}>
                                    <div className="error-message">
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <XCircle size={24} color="red" style={{ marginRight: '8px' }}/>
                                        <span>{errorMessage}</span>
                                        </div>
                                    </div>
                                 </div>
                }

                {(loading &&
                    <div className="loader-container">
                        <p className="loader-text">Data is being collected from the provided links and prepared to a form your AI assistant can understand... This might take several minutes depending on your data size</p>
                        <p className="loader-text">Progress: {progressPercent}</p>
                        <div className="loader"></div>
                    </div>
                )}

                <div className="button-container">
                    <button
                        className="create-button"
                        disabled={!isButtonEnabled}
                        onClick={handleSubmit}
                    >
                        Create Your Own RAG Model
                    </button>
                </div>

                {(processCompleted &&
                        <button
                            className="create-button"
                            onClick={redirectToChat}
                        >
                            See your new AI assistant!
                        </button>
                )}
                {/*
                    <button
                        className="create-button"
                        onClick={() => testDb()}
                    >
                        test
                     </button> */}
            </div>
        </div>
    );
}
