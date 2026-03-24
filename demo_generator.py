#!/usr/bin/env python3
"""
ProofMind Demo Data Generator
Generates realistic AI decision data for demo purposes
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend', 'sdk', 'python'))

from proofmind import ProofMind
import random
import time
import json

# Demo scenarios
LOAN_APPLICATIONS = [
    {"applicant_id": f"app_{i:04d}", "credit_score": random.randint(300, 850), 
     "income": random.randint(30000, 200000), "loan_amount": random.randint(10000, 500000)}
    for i in range(50)
]

FRAUD_TRANSACTIONS = [
    {"transaction_id": f"txn_{i:04d}", "amount": random.randint(10, 10000),
     "merchant": random.choice(["Amazon", "Walmart", "Gas Station", "Restaurant"]),
     "location": random.choice(["NY", "CA", "TX", "FL"])}
    for i in range(30)
]

def demo_credit_model(application):
    """Simulate credit risk model"""
    score = application["credit_score"]
    income = application["income"] 
    loan_amount = application["loan_amount"]
    
    risk_score = (score / 850) * 0.6 + (income / 200000) * 0.3 + (1 - loan_amount / 500000) * 0.1
    decision = "approved" if risk_score > 0.5 else "denied"
    
    return {
        "decision": decision,
        "risk_score": round(risk_score, 3),
        "factors": ["credit_score", "income", "loan_amount"]
    }

def demo_fraud_model(transaction):
    """Simulate fraud detection model"""
    amount = transaction["amount"]
    is_suspicious = amount > 5000 or random.random() < 0.1
    
    return {
        "decision": "flagged" if is_suspicious else "approved",
        "confidence": round(random.uniform(0.7, 0.99), 3),
        "risk_factors": ["high_amount"] if amount > 5000 else []
    }

def run_demo():
    print("🚀 Starting ProofMind Demo...")
    
    # Initialize SDK
    pm = ProofMind(
        enterprise_id="ent_demo",
        hcs_topic_id="0.0.12345",
        api_url="http://localhost:3001",
        mode="async",
        pii_fields=["applicant_id", "transaction_id"]
    )
    
    print("📊 Processing loan applications...")
    
    # Process loan applications
    for i, app in enumerate(LOAN_APPLICATIONS[:10]):  # First 10 for demo
        print(f"  Processing application {i+1}/10...")
        
        # Simulate AI inference
        result = demo_credit_model(app)
        
        # Notarize the decision
        receipt = pm.notarize_manual(
            model_id="credit_risk_v4.2",
            input_hash=pm.hash(app),
            output_hash=pm.hash(result),
            context="loan_application",
            sensitivity="high",
            outcome_label=result["decision"]
        )
        
        print(f"    ✓ Notarized: {receipt.notarization_id}")
        time.sleep(0.5)  # Realistic delay
    
    print("🔍 Processing fraud checks...")
    
    # Process fraud transactions
    for i, txn in enumerate(FRAUD_TRANSACTIONS[:5]):  # First 5 for demo
        print(f"  Processing transaction {i+1}/5...")
        
        result = demo_fraud_model(txn)
        
        receipt = pm.notarize_manual(
            model_id="fraud_detector_v2.1",
            input_hash=pm.hash(txn),
            output_hash=pm.hash(result),
            context="transaction_screening",
            sensitivity="medium",
            outcome_label=result["decision"]
        )
        
        print(f"    ✓ Notarized: {receipt.notarization_id}")
        time.sleep(0.5)
    
    print("🎯 Demo complete! Check the dashboard at http://localhost:5173/dashboard")

if __name__ == "__main__":
    run_demo()