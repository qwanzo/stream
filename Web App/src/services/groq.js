/**
 * Groq AI Service - streamsilu AI Film & Animation Assistant
 * Model: oss-120b (with fallback to llama-3.3-70b-versatile)
 * Documentation: https://console.groq.com/docs/quickstart
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Primary model as requested. Falls back to 70b if oss-120b is unavailable.
const GROQ_MODEL = 'oss-120b';
const GROQ_FALLBACK_MODEL = 'llama-3.3-70b-versatile';

async function callGroq(prompt, apiKey, model) {
  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey.trim()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: `You are streamsilu AI, an expert cinema recommendations assistant for streamsilu (streamsilu.cc.cd).
Recommend 4 top matching movies or TV shows based on the user's prompt.
Return ONLY a valid JSON array of objects with keys: "title", "year", "type" ("movie" or "tv"), "recommendationReason", and "tmdbId" (integer).
Example: [{"title":"Inception","year":2010,"type":"movie","recommendationReason":"Mind-bending sci-fi thriller.","tmdbId":27205}]`
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!res.ok) throw new Error(`Groq API error ${res.status}`);

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response from Groq');

  const jsonStart = content.indexOf('[');
  const jsonEnd = content.lastIndexOf(']');
  if (jsonStart === -1 || jsonEnd === -1) throw new Error('No JSON array in response');

  return JSON.parse(content.substring(jsonStart, jsonEnd + 1));
}

export async function askGroqAi(prompt, apiKey) {
  if (!prompt || !prompt.trim()) return [];

  if (apiKey) {
    // Try oss-120b first, then fall back to 70b
    for (const model of [GROQ_MODEL, GROQ_FALLBACK_MODEL]) {
      try {
        const results = await callGroq(prompt, apiKey, model);
        console.log(`streamsilu AI used model: ${model}`);
        return results;
      } catch (err) {
        console.warn(`Groq model ${model} failed:`, err.message);
      }
    }
  }

  // Offline fallback recommendations (no API key required)
  const lower = prompt.toLowerCase();

  if (lower.includes('anime') || lower.includes('japan') || lower.includes('shonen')) {
    return [
      { title: 'Demon Slayer: Kimetsu no Yaiba', year: 2019, type: 'tv', recommendationReason: 'Breathtaking ufotable animation with thrilling sword battles.', tmdbId: 85937 },
      { title: 'Attack on Titan', year: 2013, type: 'tv', recommendationReason: 'Epic dark fantasy masterpiece with jaw-dropping plot twists.', tmdbId: 1429 },
      { title: 'The Boy and the Heron', year: 2023, type: 'movie', recommendationReason: "Studio Ghibli's Oscar-winning fantasy masterpiece.", tmdbId: 508883 },
      { title: 'Arcane', year: 2021, type: 'tv', recommendationReason: 'Emmy-winning steampunk animated drama with world-class art.', tmdbId: 94605 }
    ];
  }

  if (lower.includes('action') || lower.includes('thriller') || lower.includes('spy')) {
    return [
      { title: 'Mission: Impossible – Dead Reckoning', year: 2023, type: 'movie', recommendationReason: 'Edge-of-seat practical stunt action with Tom Cruise.', tmdbId: 575264 },
      { title: 'John Wick: Chapter 4', year: 2023, type: 'movie', recommendationReason: 'Explosive choreographed action sequences.', tmdbId: 603692 },
      { title: 'Top Gun: Maverick', year: 2022, type: 'movie', recommendationReason: 'Heart-pounding aerial action sequel.', tmdbId: 361743 },
      { title: 'The Dark Knight', year: 2008, type: 'movie', recommendationReason: "Nolan's crime thriller masterpiece with Heath Ledger.", tmdbId: 155 }
    ];
  }

  if (lower.includes('family') || lower.includes('kids') || lower.includes('fun') || lower.includes('comedy')) {
    return [
      { title: 'Inside Out 2', year: 2024, type: 'movie', recommendationReason: 'Heartwarming Pixar exploration of teenage emotions.', tmdbId: 1022789 },
      { title: 'Moana 2', year: 2024, type: 'movie', recommendationReason: 'Ocean adventure packed with vibrant animation.', tmdbId: 1241982 },
      { title: 'Kung Fu Panda 4', year: 2024, type: 'movie', recommendationReason: 'Hilarious martial arts action featuring Po.', tmdbId: 1011985 },
      { title: 'The Super Mario Bros. Movie', year: 2023, type: 'movie', recommendationReason: 'Colourful fun-for-all-ages video game adventure.', tmdbId: 502356 }
    ];
  }

  // Default top picks across all genres
  return [
    { title: 'Spider-Man: Across the Spider-Verse', year: 2023, type: 'movie', recommendationReason: 'Visually revolutionary superhero multiverse masterpiece.', tmdbId: 569094 },
    { title: 'Oppenheimer', year: 2023, type: 'movie', recommendationReason: "Nolan's epic historical drama about the atomic bomb creator.", tmdbId: 872585 },
    { title: 'Arcane', year: 2021, type: 'tv', recommendationReason: 'Emmy-winning steampunk drama with world-class art.', tmdbId: 94605 },
    { title: 'Dune: Part Two', year: 2024, type: 'movie', recommendationReason: 'Grand-scale sci-fi epic with stunning desert visuals.', tmdbId: 693134 }
  ];
}
