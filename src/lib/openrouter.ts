export const analyzeResume = async (resumeText: string) => {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mixtral-8x7b-instruct",
          messages: [
            {
              role: "system",
              content: `Analyze resume and return JSON: {
              titles: string[] (5 job titles),
              skills: string[] (10 key skills),
              experience: string (years summary)
            }`,
            },
            {
              role: "user",
              content: resumeText.slice(0, 15000), // Limit to first 15k characters
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

    // Validate and normalize response
    return {
      titles: Array.isArray(result.titles) ? result.titles.slice(0, 5) : [],
      skills: Array.isArray(result.skills) ? result.skills.slice(0, 10) : [],
      experience: result.experience || "",
    };
  } catch (error) {
    console.error("AI analysis failed:", error);
    return { titles: [], skills: [], experience: "" };
  }
};
