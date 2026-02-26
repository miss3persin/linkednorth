import { decode } from 'html-entities';

const JOB_TEXT_FIELDS = [
  'jobTitle',
  'company',
  'location',
  'description',
  'jobType',
  'contractType',
  'applyLink',
  'detailsLink',
];

export function decodeHtmlEntities(value) {
  if (typeof value !== 'string') return value;

  let decoded = value;
  let lastDecoded = null;

  do {
    lastDecoded = decoded;
    decoded = decode(lastDecoded);
  } while (decoded !== lastDecoded);

  return decoded;
}

export function decodeHtmlArray(items) {
  if (!Array.isArray(items)) return items;
  return items.map(decodeHtmlEntities);
}

export function normalizeJobText(job) {
  if (!job || typeof job !== 'object') return job;

  const normalized = { ...job };

  JOB_TEXT_FIELDS.forEach((field) => {
    if (field in normalized) {
      normalized[field] = decodeHtmlEntities(normalized[field]);
    }
  });

  if (Array.isArray(normalized.skills)) {
    normalized.skills = normalized.skills.map(decodeHtmlEntities);
  }

  if (normalized.salary && typeof normalized.salary === 'object') {
    normalized.salary = {
      ...normalized.salary,
      currency: decodeHtmlEntities(normalized.salary.currency),
    };
  }

  if (normalized.attribution && typeof normalized.attribution === 'object') {
    normalized.attribution = {
      ...normalized.attribution,
      name: decodeHtmlEntities(normalized.attribution.name),
      url: decodeHtmlEntities(normalized.attribution.url),
    };
  }

  return normalized;
}
