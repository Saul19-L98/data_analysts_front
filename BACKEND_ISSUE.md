# Backend Data Issue - Charts Not Rendering

## Problem Summary

The charts are not displaying data because the backend `/charts/transform` endpoint is returning **placeholder metadata** instead of **actual chart data**.

## What's Wrong

### Expected Response Structure
```json
{
  "message": "Gráficos transformados exitosamente",
  "session_id": "sess_...",
  "charts": [
    {
      "title": "Ventas totales por tipo de papel",
      "chart_type": "bar",
      "chart_data": [
        { "paper_type": "A4", "total_sales": 8542.5 },
        { "paper_type": "Letter", "total_sales": 7583.0 },
        { "paper_type": "Legal", "total_sales": 3175.0 },
        { "paper_type": "Cardstock", "total_sales": 6360.0 }
      ],
      "x_axis_key": "paper_type",
      "y_axis_keys": ["total_sales"]
    }
  ]
}
```

### Actual Response (WRONG)
```json
{
  "charts": [
    {
      "title": "Ventas totales por tipo de papel",
      "chart_type": "bar",
      "chart_data": [
        {
          "note": "Data structure placeholder",
          "description": "Use the chart parameters to query your actual dataset",
          "x_axis": "paper_type",
          "y_axis_keys": ["total_sales"],
          "aggregations": [{"column": "total_sales", "func": "sum"}]
        }
      ],
      "x_axis_key": "paper_type",
      "y_axis_keys": ["total_sales"]
    }
  ]
}
```

## Root Cause

The backend is returning the **query parameters** instead of the **actual transformed data**. The `/charts/transform` endpoint needs to:

1. ✅ Receive the `session_id` and `suggested_charts`
2. ✅ Look up the dataset from the session (stored during `/ingest`)
3. ❌ **Execute the chart transformations** (filtering, aggregations, grouping)
4. ❌ **Return the processed data points** ready for visualization

## Frontend Changes Made

I've added defensive code to detect this issue and show helpful error messages:

### Chart Components Updated
- `LineViz.tsx` - Detects placeholder data and shows warning
- `BarViz.tsx` - Detects placeholder data and shows warning  
- `PieViz.tsx` - Detects placeholder data and shows warning

### Debug Logging Added
- `SelectionView.tsx` - Logs transform request/response to browser console

## How to Debug

1. **Open Browser Console** (F12 → Console tab)
2. **Upload a file** and select charts
3. **Look for these logs:**
   ```
   🔵 Transform Request: { session_id: "...", suggested_charts: [...] }
   🟢 Transform Response: { message: "...", charts: [...] }
   📊 Charts received: 3
   📈 First chart data sample: [...]
   ```
4. **Check if chart_data contains** `"note": "Data structure placeholder"`

## Backend Fix Needed

The backend `/charts/transform` endpoint needs to:

```python
# Example pseudocode of what the backend should do:

def transform_charts(request):
    session_id = request.session_id
    suggested_charts = request.suggested_charts
    
    # 1. Get the dataset from session storage
    dataset = get_dataset_from_session(session_id)
    
    # 2. For each suggested chart
    built_charts = []
    for chart in suggested_charts:
        # 3. Apply transformations
        if chart.parameters.get('aggregations'):
            # Group by x_axis and aggregate y_axis
            chart_data = dataset.groupby(chart.parameters['x_axis']).agg({
                agg['column']: agg['func'] 
                for agg in chart.parameters['aggregations']
            }).reset_index().to_dict('records')
        else:
            # Use raw data
            chart_data = dataset[[chart.parameters['x_axis'], *chart.parameters.get('y_axis', [])]].to_dict('records')
        
        # 4. Build the chart response
        built_charts.append({
            'title': chart.title,
            'chart_type': chart.chart_type,
            'chart_data': chart_data,  # <-- ACTUAL DATA, NOT METADATA
            'x_axis_key': chart.parameters['x_axis'],
            'y_axis_keys': chart.parameters.get('y_axis', [])
        })
    
    return {
        'message': 'Gráficos transformados exitosamente',
        'session_id': session_id,
        'charts': built_charts,
        'total_charts': len(built_charts)
    }
```

## Expected Behavior After Fix

Once the backend is fixed:

1. ✅ Charts will display with actual data
2. ✅ Aggregations will be calculated (sum, average, count, etc.)
3. ✅ Line charts will show trends over time
4. ✅ Bar charts will show comparisons
5. ✅ Pie charts will show distributions

## Testing

After fixing the backend, test with this dataset:
- Upload a CSV with sales data
- Backend should aggregate: `df.groupby('paper_type')['total_sales'].sum()`
- Frontend should receive: `[{paper_type: 'A4', total_sales: 8542.5}, ...]`
- Charts should render with visible bars/lines/slices

## Contact

If you need help implementing the backend fix, please share:
1. Backend code for `/charts/transform` endpoint
2. How you're storing the dataset in the session
3. The DataFrame transformation logic
