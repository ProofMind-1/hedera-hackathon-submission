import DocsLayout, { TocItem } from "@/components/docs/DocsLayout";
import CodeBlock from "@/components/CodeBlock";

const toc: TocItem[] = [
  { id: "single", title: "Single Verification", level: 2 },
  { id: "batch", title: "Batch Verification", level: 2 },
  { id: "regulator", title: "Regulator Verification", level: 2 },
];

const VerifyPage = () => (
  <DocsLayout toc={toc}>
    <h1 className="text-4xl font-bold mb-4">Verify Notarizations</h1>
    <p className="text-lg text-muted-foreground mb-8">
      Anyone with the original input/output data can verify a notarization.
    </p>

    <h2 id="single" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Single Verification</h2>
    <CodeBlock language="python" filename="verify.py" code={`result = pm.verify(
    notarization_id="ntx_abc123",
    original_input={"income": 75000, "score": 720},
    original_output={"approved": True, "rate": 4.5}
)

print(result.verified)        # True
print(result.consensus_time)  # "2024-01-15T10:30:00Z"
print(result.tamper_detected) # False`} />

    <h2 id="batch" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Batch Verification</h2>
    <CodeBlock language="python" filename="batch_verify.py" code={`results = pm.verify_batch(
    notarization_ids=["ntx_001", "ntx_002", "ntx_003"],
    original_data=[
        {"input": {...}, "output": {...}},
        {"input": {...}, "output": {...}},
        {"input": {...}, "output": {...}},
    ]
)

for r in results:
    print(f"{r.id}: verified={r.verified}")`} />

    <h2 id="regulator" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Regulator Verification</h2>
    <p className="text-muted-foreground mb-4">
      Regulators can verify decisions without access to your internal systems. They only need:
    </p>
    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
      <li>The notarization ID</li>
      <li>The original input and output data (provided by the enterprise)</li>
      <li>Access to the ProofMind verification API or dashboard</li>
    </ul>
  </DocsLayout>
);

export default VerifyPage;
