export const analyzeResume = async (resumeText: string, jobsData: any) => {
  try {
    // Prepare jobs information for the AI
    const jobsSummary = jobsData
      ? jobsData
          .map(
            (job) =>
              `Job Title: ${
                job.title
              }\nRequired Skills: ${job.required_skills?.join(", ")}\n\n`
          )
          .join("")
          .slice(0, 5000) // Limit jobs context
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
              content: `Analyze this resume and match it against available jobs. Return JSON format: {
                titles: string[] (suggested job titles based on resume and available jobs),
                skills: string[] (key skills from resume that match job requirements),
                experience: string (years summary),
                relevance: number (0-100, how well the resume matches the job market),
                bestMatches: {
                  jobId: string,
                  matchScore: number,
                  matchingSkills: string[]
                }[]
              }
              
              Available Jobs Summary:
              ${jobsSummary}
              `,
            },
            {
              role: "user",
              content: `Resume Content:\n${resumeText.slice(0, 15000)}`, // Limit to first 15k characters
            },
          ],
          response_format: { type: "json_object" },
          max_tokens: 1500, // Increased for more comprehensive analysis
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`OpenRouter error: ${response.statusText}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    // Validate and normalize response
    return {
      titles: Array.isArray(result.titles) ? result.titles.slice(0, 5) : [],
      skills: Array.isArray(result.skills) ? result.skills.slice(0, 15) : [],
      experience: result.experience || "",
      relevance:
        typeof result.relevance === "number"
          ? Math.min(100, Math.max(0, result.relevance))
          : 0,
      bestMatches: Array.isArray(result.bestMatches) ? result.bestMatches : [],
    };
  } catch (error) {
    console.error("AI analysis failed:", error);
    return {
      titles: [],
      skills: [],
      experience: "",
      relevance: 0,
      bestMatches: [],
    };
  }
};
