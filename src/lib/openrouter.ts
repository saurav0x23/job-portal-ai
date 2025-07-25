export const analyzeResume = async (resumeText: string, jobsData: any) => {
  try {
    const jobsSummary = jobsData
      ? jobsData
          .map(
            (job: any) =>
              `---\n[Job ID: ${job.id}]\nTitle: ${job.title}\nCompany: ${
                job.company
              }\nLocation: ${job.location}\nSkills: ${job.required_skills?.join(
                ", "
              )}\n`
          )
          .join("\n")
          .slice(0, 5000)
      : "No job data provided";

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mixtral-8x7b-instruct",
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant. Analyze the following resume and find the 3–5 best matching jobs from the job list. Return only their Job IDs (exactly as written) in this format:

{
  "matchedJobIds": ["", ""],
}

Only use the Job IDs that are explicitly labeled as [Job ID: xxxx] below.

Jobs:
${jobsSummary}`,
            },
            {
              role: "user",
              content: `Resume Content:\n${resumeText.slice(0, 15000)}`,
            },
          ],
          response_format: { type: "json_object" },
          max_tokens: 1000,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`OpenRouter error: ${response.statusText}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return {
      matchedJobIds: Array.isArray(result.matchedJobIds)
        ? result.matchedJobIds
        : [],
    };
  } catch (error) {
    console.error("AI analysis failed:", error);
    return {
      matchedJobIds: [],
    };
  }
};
