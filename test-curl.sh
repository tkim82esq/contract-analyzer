#!/bin/bash

echo "=== TESTING HYBRID FLOW WITH CURL ==="
echo ""

# Read the contract text
CONTRACT_TEXT=$(cat test-contract.txt)
echo "Contract length: ${#CONTRACT_TEXT}"
echo "Contract type: Service Agreement"
echo "Party role: Service Provider"
echo ""

# Make the API call
echo "Making API call..."
curl -X POST \
  -F "contractText=${CONTRACT_TEXT}" \
  -F "contractType=Service Agreement" \
  -F "partyRole=Service Provider" \
  -F "includeClauseBreakdown=false" \
  -F 'extractedParties={"Client": "ABC Corp", "Service Provider": "XYZ Services"}' \
  http://localhost:3001/api/analyze \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s \
  | jq -r '.analysis.risks | length as $count | "Total risks found: \($count)"' 2>/dev/null || echo "Response received (check server logs for details)"

echo ""
echo "🎯 Check the server terminal for detailed flow logging!"
echo "🎯 Look for these log patterns:"
echo "   === RISK ANALYSIS FLOW ==="
echo "   Template found: true"
echo "   Running template analysis: true"
echo "   Running general analysis: true"
echo "   === STARTING TEMPLATE-SPECIFIC ANALYSIS ==="
echo "   Template risks found: [N]"
echo "   === STARTING GENERAL ANALYSIS ==="
echo "   General risks found: [N]"
echo "   === MERGING RESULTS ==="
echo "   Combined total risks: [N]"
echo "   Risk breakdown: { high: X, medium: Y, low: Z }"
echo "   Risk sources: { template: X, general: Y, hybrid: Z }"
echo "   === ENHANCED ANALYSIS COMPLETE ==="