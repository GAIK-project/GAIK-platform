import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, X } from "lucide-react";
import { useState } from "react";

interface SchemaField {
  name: string;
  type: string;
  required: boolean;
}

interface JsonSchemaGeneratorProps {
  onSchemaGenerate: (schema: string) => void;
}

export function JsonSchemaGenerator({
  onSchemaGenerate,
}: JsonSchemaGeneratorProps) {
  const [fields, setFields] = useState<SchemaField[]>([]);

  const addField = () => {
    setFields([...fields, { name: "", type: "string", required: false }]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, field: Partial<SchemaField>) => {
    setFields(fields.map((f, i) => (i === index ? { ...f, ...field } : f)));
  };

  const generateSchema = () => {
    const schema = {
      type: "object",
      properties: Object.fromEntries(
        fields.map((field) => [field.name, { type: field.type }]),
      ),
      required: fields
        .filter((field) => field.required)
        .map((field) => field.name),
    };
    onSchemaGenerate(JSON.stringify(schema, null, 2));
  };

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            placeholder="Field name"
            value={field.name}
            onChange={(e) => updateField(index, { name: e.target.value })}
          />
          <Select
            value={field.type}
            onValueChange={(value) => updateField(index, { type: value })}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="string">String</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="array">Array</SelectItem>
              <SelectItem value="object">Object</SelectItem>
            </SelectContent>
          </Select>
          <Label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) =>
                updateField(index, { required: e.target.checked })
              }
            />
            <span>Required</span>
          </Label>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeField(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={addField}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Field
      </Button>
      <Button onClick={generateSchema}>Generate Schema</Button>
    </div>
  );
}
