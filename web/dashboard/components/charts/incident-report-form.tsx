"use client";

import { processIncidentReport } from "@/ai/ai-actions/incident";
import { TranscriptionModal } from "@/components/charts/transcription-modal";
import { VoiceRecorder } from "@/components/charts/voice-recorder";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { readStreamableValue } from "ai/rsc";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Lightbulb,
  Loader2,
} from "lucide-react";
import React, { useCallback, useRef, useState } from "react";

type ReportType = {
  reportTitle: string;
  incidentSummary: string;
  causeAnalysis: string;
  recommendedActions: string;
  incidentTimestamp: string;
};

export default function IncidentReportForm() {
  const placeholderText = `
  On October 10, 2024, at approximately 3:45 PM, a significant incident occurred at our production facility in Building 3. An unexpected malfunction in one of the primary cooling systems led to a rapid temperature increase in the assembly area. The automated safety protocols were immediately triggered, and all personnel were evacuated without incident. Although no injuries were reported, production was halted for nearly 2 hours, causing substantial downtime. Preliminary investigations suggest that a faulty sensor may have caused the system to overheat. A comprehensive review of the cooling system and an update to the maintenance procedures are recommended to prevent similar incidents in the future.
  `;

  const [incidentDetails, setIncidentDetails] = useState(
    placeholderText.trim(),
  );
  const [partialReport, setPartialReport] = useState<Partial<ReportType>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New state for voice transcription
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transcription, setTranscription] = useState("");

  // Create a ref for the form
  const formRef = useRef<HTMLFormElement>(null);

  const handleTranscriptionComplete = useCallback((text: string) => {
    setTranscription(text);
    setIsModalOpen(true);
  }, []);

  const handleConfirmTranscription = useCallback(() => {
    setIncidentDetails(transcription);
    setIsModalOpen(false);

    // Add a slight delay to ensure state is updated before submitting
    setTimeout(() => {
      // Automatically submit the form after confirming transcription
      if (formRef.current) {
        formRef.current.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true }),
        );
      }
    }, 100);
  }, [transcription]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsProcessing(true);
      setError(null);
      setPartialReport({});

      try {
        const { object } = await processIncidentReport(incidentDetails);

        for await (const partialObject of readStreamableValue(object)) {
          if (partialObject) {
            setPartialReport((prev) => ({
              ...prev,
              ...partialObject,
            }));
          }
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Error generating report",
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [incidentDetails],
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Automated Incident Reporting
          </h1>
          <Badge variant="secondary" className="ml-2">
            AI-Powered
          </Badge>
        </div>
        <p className="text-muted-foreground mt-1">
          With o3-mini reasoning effort set to medium
        </p>
        <Separator className="my-4" />
      </div>

      <Card className="border border-border shadow-xs">
        <CardHeader className="bg-muted/40">
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Incident Details
          </CardTitle>
          <CardDescription>
            Provide detailed information about the incident to generate a
            comprehensive report.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <VoiceRecorder
                onTranscriptionComplete={handleTranscriptionComplete}
                isTranscribing={isTranscribing}
                setIsTranscribing={setIsTranscribing}
              />
              <span className="text-sm text-muted-foreground">
                {isTranscribing
                  ? "Transcribing speech..."
                  : "Click microphone to dictate incident details"}
              </span>
            </div>
            <Textarea
              value={incidentDetails}
              onChange={(e) => setIncidentDetails(e.target.value)}
              placeholder="Enter incident details (e.g., what happened, where, when, and any additional context)..."
              rows={8}
              className="min-h-[200px] resize-y border-border focus:border-primary focus:ring-primary"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isProcessing || isTranscribing}
                className="px-4 py-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="border border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {(isProcessing || Object.keys(partialReport).length > 0) && (
        <Card className="border border-border shadow-xs">
          <CardHeader
            className={`${partialReport.reportTitle ? "bg-muted/40" : "bg-muted/20"}`}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                {partialReport.reportTitle ? (
                  partialReport.reportTitle
                ) : (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Report...
                  </>
                )}
              </CardTitle>
              {!isProcessing && Object.keys(partialReport).length === 5 && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Complete
                </Badge>
              )}
              {isProcessing && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Processing
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Incident Summary Section */}
            <div className="space-y-2">
              <div className="flex items-center text-sm font-medium text-muted-foreground">
                <AlertTriangle className="mr-2 h-4 w-4" />
                <h3>Incident Summary</h3>
              </div>
              {partialReport.incidentSummary ? (
                <p className="text-sm leading-relaxed">
                  {partialReport.incidentSummary}
                </p>
              ) : (
                isProcessing && (
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-full max-w-[95%]"></div>
                )
              )}
            </div>

            {/* Cause Analysis Section */}
            <div className="space-y-2">
              <div className="flex items-center text-sm font-medium text-muted-foreground">
                <Lightbulb className="mr-2 h-4 w-4" />
                <h3>Cause Analysis</h3>
              </div>
              {partialReport.causeAnalysis ? (
                <p className="text-sm leading-relaxed">
                  {partialReport.causeAnalysis}
                </p>
              ) : (
                isProcessing && (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-full max-w-[90%]"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-full max-w-[75%]"></div>
                  </div>
                )
              )}
            </div>

            {/* Recommended Actions Section */}
            <div className="space-y-2">
              <div className="flex items-center text-sm font-medium text-muted-foreground">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                <h3>Recommended Actions</h3>
              </div>
              {partialReport.recommendedActions ? (
                <p className="text-sm leading-relaxed">
                  {partialReport.recommendedActions}
                </p>
              ) : (
                isProcessing && (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-full max-w-[85%]"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-full max-w-[70%]"></div>
                  </div>
                )
              )}
            </div>

            {/* Timestamp Section */}
            <div className="space-y-2">
              <div className="flex items-center text-sm font-medium text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                <h3>Timestamp</h3>
              </div>
              {partialReport.incidentTimestamp ? (
                <p className="text-sm font-medium">
                  {partialReport.incidentTimestamp}
                </p>
              ) : (
                isProcessing && (
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-40"></div>
                )
              )}
            </div>
          </CardContent>
          {!isProcessing && Object.keys(partialReport).length === 5 && (
            <CardFooter className="bg-muted/20 border-t border-border py-3 px-6">
              <p className="text-xs text-muted-foreground">
                Report generated by AI based on the provided incident details.
                Review for accuracy before using.
              </p>
            </CardFooter>
          )}
        </Card>
      )}

      <TranscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transcription={transcription}
        onConfirm={handleConfirmTranscription}
        onEdit={setTranscription}
      />
    </div>
  );
}
