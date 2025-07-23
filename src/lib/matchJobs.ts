// // Simple matching algorithm

// interface Job {
//   id: string;
//   title: string;
//   description: string;
//   company: string;
//   location: string;
//   skills: string[];
//   required_skills: string[];
// }
// export const matchJobs = (jobs: Job[], aiData: any) => {
//   return jobs
//     .map((job) => {
//       let score = 0;

//       // Title match
//       if (
//         aiData.titles.some((title: string) =>
//           job.title.toLowerCase().includes(title.toLowerCase())
//         )
//       ) {
//         score += 30;
//       }

//       // Skills match
//       const matchedSkills = job.required_skills.filter((skill) =>
//         aiData.skills.includes(skill)
//       );
//       score += matchedSkills.length * 10;

//       return { ...job, relevance: Math.min(100, score) };
//     })
//     .sort((a, b) => b.relevance - a.relevance);
// };
