from proofmind import ProofMind

# Initialize ProofMind SDK
pm = ProofMind(
    enterprise_id="ent_demo_bank",
    hcs_topic_id="0.0.12345",
    mode="async",
    pii_fields=["ssn", "email", "dob"]
)

# Example 1: Decorator pattern
@pm.notarize(
    model_id="credit_risk_v4.2",
    context="loan_application_decision",
    sensitivity="high"
)
def credit_decision(applicant_data):
    # Your AI model inference
    score = ai_model.predict(applicant_data)
    return {"approved": score > 0.7, "score": score}

# Example 2: Manual notarization
applicant = {
    "income": 75000,
    "credit_score": 720,
    "ssn": "123-45-6789"  # Will be scrubbed
}

result = credit_decision(applicant)
print(f"Decision: {result}")

# Example 3: Explicit manual call
input_hash = pm.hash(applicant)
output_hash = pm.hash(result)

receipt = pm.notarize_manual(
    model_id="credit_risk_v4.2",
    input_hash=input_hash,
    output_hash=output_hash,
    context="loan_application_decision",
    outcome_label="approved"
)

print(f"Notarization ID: {receipt.notarization_id}")
