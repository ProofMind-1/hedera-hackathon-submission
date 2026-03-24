import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import Architecture from "./pages/Architecture";
import Security from "./pages/Security";
import Blog from "./pages/Blog";
import Company from "./pages/Company";
import SDK from "./pages/SDK";
import Changelog from "./pages/Changelog";
import Playground from "./pages/Playground";
import FinancialServices from "./pages/use-cases/FinancialServices";
import Healthcare from "./pages/use-cases/Healthcare";
import EnterpriseCompliance from "./pages/use-cases/EnterpriseCompliance";

// Docs pages
import DocsIntro from "./pages/docs/DocsIntro";
import WhyImmutableAudits from "./pages/docs/WhyImmutableAudits";
import HowItWorksDocs from "./pages/docs/HowItWorksDocs";
import InstallSDK from "./pages/docs/quickstart/InstallSDK";
import InitializeSDK from "./pages/docs/quickstart/InitializeSDK";
import WrapInference from "./pages/docs/quickstart/WrapInference";
import VerifyPage from "./pages/docs/quickstart/VerifyPage";
import PythonSDK from "./pages/docs/sdk/PythonSDK";
import NodeSDK from "./pages/docs/sdk/NodeSDK";
import ArchOverview from "./pages/docs/architecture/ArchOverview";
import EuAiAct from "./pages/docs/compliance/EuAiAct";
import {
  DecoratorUsage,
  ManualNotarization,
  BatchNotarization,
  DataFlow,
  HashingModel,
  HederaHCS,
  AWSKMS,
  RegisterModels,
  ModelVersioning,
  ModelLifecycle,
  AuditAgentOverview,
  AnomalyDetection,
  RegulatorQueries,
  ComplianceReports,
  SingleVerification,
  BatchVerification,
  TamperDetection,
  SECCompliance,
  HIPAACompliance,
  SecurityHashing,
  KeyManagement,
  ThreatModel,
} from "./pages/docs/DocPages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/security" element={<Security />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/company" element={<Company />} />
          <Route path="/sdk" element={<SDK />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/use-cases/financial-services" element={<FinancialServices />} />
          <Route path="/use-cases/healthcare" element={<Healthcare />} />
          <Route path="/use-cases/enterprise" element={<EnterpriseCompliance />} />

          {/* Documentation */}
          <Route path="/docs" element={<DocsIntro />} />
          <Route path="/docs/why-immutable-audits" element={<WhyImmutableAudits />} />
          <Route path="/docs/how-it-works" element={<HowItWorksDocs />} />

          {/* Quick Start */}
          <Route path="/docs/quickstart/install" element={<InstallSDK />} />
          <Route path="/docs/quickstart/initialize" element={<InitializeSDK />} />
          <Route path="/docs/quickstart/wrap-inference" element={<WrapInference />} />
          <Route path="/docs/quickstart/verify" element={<VerifyPage />} />

          {/* SDK Reference */}
          <Route path="/docs/sdk/python" element={<PythonSDK />} />
          <Route path="/docs/sdk/nodejs" element={<NodeSDK />} />

          {/* SDK Examples */}
          <Route path="/docs/examples/decorator" element={<DecoratorUsage />} />
          <Route path="/docs/examples/manual" element={<ManualNotarization />} />
          <Route path="/docs/examples/batch" element={<BatchNotarization />} />

          {/* Architecture */}
          <Route path="/docs/architecture/overview" element={<ArchOverview />} />
          <Route path="/docs/architecture/data-flow" element={<DataFlow />} />
          <Route path="/docs/architecture/hashing" element={<HashingModel />} />
          <Route path="/docs/architecture/hedera-hcs" element={<HederaHCS />} />
          <Route path="/docs/architecture/aws-kms" element={<AWSKMS />} />

          {/* Model Registry */}
          <Route path="/docs/model-registry/register" element={<RegisterModels />} />
          <Route path="/docs/model-registry/versioning" element={<ModelVersioning />} />
          <Route path="/docs/model-registry/lifecycle" element={<ModelLifecycle />} />

          {/* Audit Agent */}
          <Route path="/docs/audit-agent/overview" element={<AuditAgentOverview />} />
          <Route path="/docs/audit-agent/anomaly-detection" element={<AnomalyDetection />} />
          <Route path="/docs/audit-agent/queries" element={<RegulatorQueries />} />
          <Route path="/docs/audit-agent/reports" element={<ComplianceReports />} />

          {/* Verification */}
          <Route path="/docs/verification/single" element={<SingleVerification />} />
          <Route path="/docs/verification/batch" element={<BatchVerification />} />
          <Route path="/docs/verification/tamper-detection" element={<TamperDetection />} />

          {/* Compliance */}
          <Route path="/docs/compliance/eu-ai-act" element={<EuAiAct />} />
          <Route path="/docs/compliance/sec" element={<SECCompliance />} />
          <Route path="/docs/compliance/hipaa" element={<HIPAACompliance />} />

          {/* Security */}
          <Route path="/docs/security/hashing" element={<SecurityHashing />} />
          <Route path="/docs/security/key-management" element={<KeyManagement />} />
          <Route path="/docs/security/threat-model" element={<ThreatModel />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
