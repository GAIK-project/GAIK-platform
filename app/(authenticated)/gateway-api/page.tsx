"use client";

import { JsonSchemaGenerator } from "@/components/json-schema-generator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Copy,
  Edit2,
  PlusCircle,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";

const API_URL_PREFIX = "https://api.yourdomain.com";

// Define the endpoint schema and enforce that for structured endpoints a nonempty schema is provided.
const EndpointSchema = z
  .object({
    id: z.string(),
    name: z.string().min(1, "Name is required"),
    status: z.enum(["active", "inactive"]),
    url: z
      .string()
      .min(1, "URL is required")
      .startsWith("/", "URL must start with /"),
    llmModel: z.string().min(1, "LLM Model is required"),
    outputType: z.enum(["raw", "structured"]),
    schema: z.string().optional(),
  })
  .refine(
    (data) =>
      data.outputType === "raw" ||
      (data.outputType === "structured" &&
        data.schema &&
        data.schema.trim() !== ""),
    {
      message: "Schema is required for structured output",
      path: ["schema"],
    }
  );

type Endpoint = z.infer<typeof EndpointSchema>;

export default function DashboardPage() {
  // Sample endpoints data
  const [endpoints, setEndpoints] = useState<Endpoint[]>([
    {
      id: "1",
      name: "User Authentication",
      status: "active",
      url: "/auth",
      llmModel: "gpt-3.5-turbo",
      outputType: "raw",
      schema: "",
    },
    {
      id: "2",
      name: "Product Catalog",
      status: "active",
      url: "/products",
      llmModel: "gpt-4",
      outputType: "structured",
      schema:
        '{"type":"object","properties":{"name":{"type":"string"},"price":{"type":"number"}}}',
    },
  ]);

  // State for the new endpoint form
  const [newEndpoint, setNewEndpoint] = useState<Partial<Endpoint>>({
    name: "",
    url: "",
    llmModel: "gpt-3.5-turbo",
    outputType: "raw",
    schema: "",
  });
  // Controls whether the "Generate JSON Schema" dialog for new endpoints is open
  const [newEndpointSchemaDialogOpen, setNewEndpointSchemaDialogOpen] =
    useState(false);

  // States for editing an existing endpoint
  const [editingEndpointId, setEditingEndpointId] = useState<string | null>(null);
  const [editingEndpointData, setEditingEndpointData] = useState<Endpoint | null>(
    null
  );
  // Controls the JSON schema dialog in editing mode
  const [isEditingSchemaDialogOpen, setIsEditingSchemaDialogOpen] =
    useState(false);

  // Validate an endpoint using Zod and show errors (if any)
  const validateEndpoint = (endpoint: Endpoint) => {
    try {
      EndpointSchema.parse(endpoint);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map(
          (err) => `${err.path.join(".")}: ${err.message}`
        );
        toast.error(messages.join("\n"));
      }
      return false;
    }
  };

  // Toggle the active/inactive status (updates either the editing state or the main list)
  const toggleEndpointStatus = (id: string) => {
    if (editingEndpointId === id && editingEndpointData) {
      setEditingEndpointData({
        ...editingEndpointData,
        status: editingEndpointData.status === "active" ? "inactive" : "active",
      });
    } else {
      setEndpoints((prev) =>
        prev.map((endpoint) =>
          endpoint.id === id
            ? {
                ...endpoint,
                status: endpoint.status === "active" ? "inactive" : "active",
              }
            : endpoint
        )
      );
    }
    toast.success("Endpoint status updated");
  };

  // Copy the full API URL to clipboard
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(API_URL_PREFIX + url);
    toast.success("API endpoint URL copied to clipboard");
  };

  // Add a new endpoint (validate on submission)
  const addNewEndpoint = () => {
    const endpointToAdd: Endpoint = {
      id: Date.now().toString(), // Use timestamp as an ID
      name: newEndpoint.name?.trim() || "",
      status: "active",
      url: newEndpoint.url?.trim() || "",
      llmModel: newEndpoint.llmModel || "gpt-3.5-turbo",
      outputType: newEndpoint.outputType === "structured" ? "structured" : "raw",
      schema: newEndpoint.schema || "",
    };

    if (validateEndpoint(endpointToAdd)) {
      setEndpoints((prev) => [...prev, endpointToAdd]);
      setNewEndpoint({
        name: "",
        url: "",
        llmModel: "gpt-3.5-turbo",
        outputType: "raw",
        schema: "",
      });
      toast.success(`Endpoint "${endpointToAdd.name}" added successfully`);
    }
  };

  // Delete an endpoint and clear editing state if necessary
  const deleteEndpoint = (id: string) => {
    setEndpoints((prev) => prev.filter((endpoint) => endpoint.id !== id));
    toast.success("Endpoint deleted successfully");
    if (editingEndpointId === id) {
      setEditingEndpointId(null);
      setEditingEndpointData(null);
    }
  };

  // Begin editing by storing a copy of the endpoint in local editing state
  const startEditing = (endpoint: Endpoint) => {
    setEditingEndpointId(endpoint.id);
    setEditingEndpointData({ ...endpoint });
  };

  // Save edited endpoint after validation and update the main endpoints list
  const saveEditing = () => {
    if (editingEndpointData && validateEndpoint(editingEndpointData)) {
      setEndpoints((prev) =>
        prev.map((endpoint) =>
          endpoint.id === editingEndpointData.id ? editingEndpointData : endpoint
        )
      );
      setEditingEndpointId(null);
      setEditingEndpointData(null);
      toast.success("Endpoint updated successfully");
    }
  };

  // Cancel editing mode
  const cancelEditing = () => {
    setEditingEndpointId(null);
    setEditingEndpointData(null);
  };

  // Format a JSON schema string for display in a pretty-printed format
  const formatSchema = (schema: string) => {
    try {
      return JSON.stringify(JSON.parse(schema), null, 2);
    } catch {
      return schema;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">API Gateway Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {/* API Endpoints Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
            <CardDescription>Manage your public API endpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {endpoints.map((endpoint) =>
                editingEndpointId === endpoint.id && editingEndpointData ? (
                  // --- EDITING MODE ---
                  <div key={endpoint.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-2">
                        <div>
                          <Label className="block">Name</Label>
                          <Input
                            value={editingEndpointData.name}
                            onChange={(e) =>
                              setEditingEndpointData({
                                ...editingEndpointData,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label className="block">URL</Label>
                          <Input
                            value={editingEndpointData.url}
                            onChange={(e) =>
                              setEditingEndpointData({
                                ...editingEndpointData,
                                url: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Switch
                          checked={editingEndpointData.status === "active"}
                          onCheckedChange={() =>
                            setEditingEndpointData({
                              ...editingEndpointData,
                              status:
                                editingEndpointData.status === "active"
                                  ? "inactive"
                                  : "active",
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center">
                      <div>
                        <Label>LLM Model</Label>
                        <Select
                          value={editingEndpointData.llmModel}
                          onValueChange={(value) =>
                            setEditingEndpointData({
                              ...editingEndpointData,
                              llmModel: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select LLM Model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gpt-3.5-turbo">
                              GPT-3.5 Turbo
                            </SelectItem>
                            <SelectItem value="gpt-4">GPT-4</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Output Type</Label>
                        <Select
                          value={editingEndpointData.outputType}
                          onValueChange={(value) =>
                            setEditingEndpointData({
                              ...editingEndpointData,
                              outputType: value as "raw" | "structured",
                            })
                          }
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Output Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="raw">Raw</SelectItem>
                            <SelectItem value="structured">
                              Structured
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {editingEndpointData.outputType === "structured" && (
                        <div className="mt-4">
                          <Dialog
                            open={isEditingSchemaDialogOpen}
                            onOpenChange={setIsEditingSchemaDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline">
                                Edit Schema
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Edit JSON Schema</DialogTitle>
                                <DialogDescription>
                                  Update the JSON schema for this endpoint.
                                </DialogDescription>
                              </DialogHeader>
                              <JsonSchemaGenerator
                                onSchemaGenerate={(schema) => {
                                  setEditingEndpointData({
                                    ...editingEndpointData,
                                    schema,
                                  });
                                  setIsEditingSchemaDialogOpen(false);
                                }}
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={saveEditing}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={cancelEditing}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  // --- DISPLAY MODE ---
                  <div
                    key={endpoint.id}
                    className="flex flex-col space-y-2 p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{endpoint.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {API_URL_PREFIX}
                          {endpoint.url}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={endpoint.status === "active"}
                          onCheckedChange={() => toggleEndpointStatus(endpoint.id)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(endpoint.url)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditing(endpoint)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteEndpoint(endpoint.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Badge>{endpoint.llmModel}</Badge>
                      <Badge>{endpoint.outputType}</Badge>
                    </div>
                    {endpoint.outputType === "structured" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            View Schema
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>JSON Schema</DialogTitle>
                            <DialogDescription>
                              The structured output schema for this endpoint.
                            </DialogDescription>
                          </DialogHeader>
                          <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[300px]">
                            <code>{formatSchema(endpoint.schema ?? "")}</code>
                          </pre>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                )
              )}

              {/* --- New Endpoint Form --- */}
              <div className="flex flex-col space-y-2 p-4 border rounded-lg">
                <h2 className="font-medium">Add New Endpoint</h2>
                <Input
                  placeholder="Endpoint Name"
                  value={newEndpoint.name}
                  onChange={(e) =>
                    setNewEndpoint({ ...newEndpoint, name: e.target.value })
                  }
                />
                <div className="flex items-center space-x-2">
                  <Label className="w-auto shrink-0">{API_URL_PREFIX}</Label>
                  <Input
                    placeholder="Endpoint URL (e.g., /products)"
                    value={newEndpoint.url}
                    onChange={(e) =>
                      setNewEndpoint({ ...newEndpoint, url: e.target.value })
                    }
                  />
                </div>
                <div className="flex space-x-2">
                  <Select
                    value={newEndpoint.llmModel}
                    onValueChange={(value) =>
                      setNewEndpoint({ ...newEndpoint, llmModel: value })
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select LLM Model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-3.5-turbo">
                        GPT-3.5 Turbo
                      </SelectItem>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={newEndpoint.outputType}
                    onValueChange={(value) =>
                      setNewEndpoint({
                        ...newEndpoint,
                        outputType: value as "raw" | "structured",
                      })
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Output Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="raw">Raw</SelectItem>
                      <SelectItem value="structured">Structured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newEndpoint.outputType === "structured" && (
                  <Dialog
                    open={newEndpointSchemaDialogOpen}
                    onOpenChange={setNewEndpointSchemaDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setNewEndpointSchemaDialogOpen(true)}
                      >
                        Generate JSON Schema
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Generate JSON Schema</DialogTitle>
                        <DialogDescription>
                          Use this tool to easily generate a JSON schema for your structured output.
                        </DialogDescription>
                      </DialogHeader>
                      <JsonSchemaGenerator
                        onSchemaGenerate={(schema) => {
                          setNewEndpoint({ ...newEndpoint, schema });
                          setNewEndpointSchemaDialogOpen(false);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                )}
                <Button onClick={addNewEndpoint}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Endpoint
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Button
                variant="outline"
                className="h-20 flex-col"
                onClick={() => toast.success("API keys refreshed successfully")}
              >
                <RefreshCw className="mb-2 h-5 w-5" />
                Refresh Keys
              </Button>
              {/* Additional quick actions can be added here */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
