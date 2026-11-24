const cache = new Map();
const CACHE_TIME = 60 * 60 * 1000; // 1 ghanta

const searchJobs = async (req, res) => {
  try {
    const { query = "", location = "" } = req.query;

    if (!query.trim()) {
      return res
        .status(400)
        .json({ message: "Please enter a job title or field" });
    }

    if (!process.env.RAPIDAPI_KEY) {
      return res.status(500).json({ message: "Search key is not set on server" });
    }

    const fullQuery = location.trim()
      ? `${query.trim()} in ${location.trim()}`
      : query.trim();

    const key = fullQuery.toLowerCase();
    const cached = cache.get(key);
    if (cached && Date.now() - cached.time < CACHE_TIME) {
      return res.json(cached.data);
    }

    const params = new URLSearchParams({
      query: fullQuery,
      page: "1",
      num_pages: "1",
      country: "pk",
    });

    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search-v2?${params.toString()}`,
      {
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
      }
    );

    if (response.status === 429) {
      return res
        .status(429)
        .json({ message: "Search limit reached, please try later" });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.log("JSearch status:", response.status);
      console.log("JSearch reply:", errorText);
      return res.status(502).json({
        message: `Job source error (${response.status})`,
      });
    }

    const raw = await response.json();

    // Jobs ki list alag alag jagah ho sakti hai, isliye teen jagah check karte hain
    const list = Array.isArray(raw.data)
      ? raw.data
      : Array.isArray(raw.data?.jobs)
      ? raw.data.jobs
      : Array.isArray(raw.jobs)
      ? raw.jobs
      : [];

    if (list.length === 0) {
      console.log("Response keys:", Object.keys(raw));
      console.log("Data keys:", raw.data ? Object.keys(raw.data) : "no data");
    }

    const jobs = list.map((j) => ({
      id: j.job_id,
      role: j.job_title,
      company: j.employer_name,
      logo: j.employer_logo,
      location: [j.job_city, j.job_state, j.job_country]
        .filter(Boolean)
        .join(", "),
      type: j.job_employment_type,
      salary:
        j.job_min_salary && j.job_max_salary
          ? `${j.job_salary_currency || ""} ${j.job_min_salary} - ${j.job_max_salary}`.trim()
          : "",
      applyLink: j.job_apply_link,
      source: j.job_publisher,
      postedAt: j.job_posted_at_datetime_utc,
      description: j.job_description ? j.job_description.slice(0, 300) : "",
    }));

    // Sirf tab cache karo jab jobs mili hon (khali result 1 ghanta yaad na rahe)
    if (jobs.length > 0) {
      cache.set(key, { time: Date.now(), data: jobs });
    }

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { searchJobs };