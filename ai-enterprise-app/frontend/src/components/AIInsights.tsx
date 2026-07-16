import { useEffect, useState } from "react";

interface Insight {
  recommendation: string;
  risk: string;
  savings: number;
  vendor: string;
}


export default function AIInsights() {

  const [insight, setInsight] = useState<Insight | null>(null);


  useEffect(() => {

    fetch("http://127.0.0.1:8001/procurement/insights/1")
      .then(res => res.json())
      .then(data => setInsight(data))
      .catch(err => console.log(err));

  }, []);



  return (

    <div className="bg-white rounded-xl shadow p-6 mt-8">

      <h2 className="text-2xl font-bold mb-4">
        AI Insights
      </h2>


      {insight ? (

        <div>

          <p className="text-lg font-semibold">
            {insight.recommendation}
          </p>


          <p className="mt-3">
            Vendor:
            <b className="ml-2">
              {insight.vendor}
            </b>
          </p>


          <p>
            Risk:
            <b className="text-green-600 ml-2">
              {insight.risk}
            </b>
          </p>


          <p>
            Estimated Savings:
            <b className="text-green-600 ml-2">
              ${insight.savings}
            </b>
          </p>


        </div>

      ) : (

        <p>
          Loading AI recommendation...
        </p>

      )}


    </div>

  );
}