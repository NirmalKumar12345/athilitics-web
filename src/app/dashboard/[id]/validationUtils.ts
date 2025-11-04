/**
 * Parses a string representing an array field path (e.g., "field[0].subfield").
 * Extracts the array field name, index, and subfield name if the path matches the expected format.
 *
 * @param {string} path - The array field path to parse. Expected format: "field[index].subfield".
 * @returns {{ arrayField: string; idx: number; field: string } | null}
 *          An object containing the array field name, index, and subfield name if parsing is successful,
 *          or null if the path does not match the expected format.
 */

function parseArrayFieldPath(
  path: string
): { arrayField: string | null; idx: number | null; field: string | null }[] | null {
  // Supports nested paths like 'divisions[0].categories[1].field'
  const regex = /(\w+)\[(\d+)\]|(\w+)/g;
  const matches = [...path.matchAll(regex)];
  if (matches.length > 0) {
    return matches
      .map((match) => {
        if (match[1] && match[2]) {
          return { arrayField: match[1], idx: Number(match[2]), field: null };
        } else if (match[3]) {
          return { arrayField: null, idx: null, field: match[3] };
        }
        return null;
      })
      .filter(Boolean) as {
      arrayField: string | null;
      idx: number | null;
      field: string | null;
    }[];
  }
  return null;
}

export async function collectTabValidationErrors(schema: any, values: any) {
  try {
    await schema.validate(values, { abortEarly: false });
    return null;
  } catch (error: any) {
    const validationErrors: { [key: string]: any } = {};
    error.inner?.forEach((err: any) => {
      if (err.path) {
        const parsed = parseArrayFieldPath(err.path);
        if (parsed && parsed.length > 1) {
          // Traverse and assign error message at the correct nested location
          let ref = validationErrors;
          for (let i = 0; i < parsed.length - 1; i++) {
            const seg = parsed[i];
            if (seg.arrayField && seg.idx !== null) {
              if (!ref[seg.arrayField]) ref[seg.arrayField] = [];
              if (!ref[seg.arrayField][seg.idx]) ref[seg.arrayField][seg.idx] = {};
              ref = ref[seg.arrayField][seg.idx];
            } else if (seg.field) {
              if (!ref[seg.field]) ref[seg.field] = {};
              ref = ref[seg.field];
            }
          }
          // Last segment is the field name
          const last = parsed[parsed.length - 1];
          if (last.field) {
            ref[last.field] = err.message;
          }
        } else if (parsed && parsed.length === 1 && parsed[0].field) {
          validationErrors[parsed[0].field] = err.message;
        } else {
          validationErrors[err.path] = err.message;
        }
      }
    });
    return { errors: validationErrors };
  }
}
