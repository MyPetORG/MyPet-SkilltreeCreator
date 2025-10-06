/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (c) 2025 UserDerezzed
 *
 * This file is part of MyPet-SkilltreeCreator.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License, version 3 only.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with this program. See the LICENSE.md file for details.
 */

/*
  json-io.ts — Small helpers for reading and writing Skilltree JSON files

  Responsibilities
  - loadExampleTrees: fetch bundled example .st.json files from /public/examples
  - downloadJSON: trigger a client-side download for a given JS object
  - readDroppedFiles: parse user-selected JSON files into SkilltreeFile objects

  Notes
  - All functions are browser-only and use the Fetch/File/Blob APIs.
  - Functions are intentionally small and avoid throwing; callers can handle errors.
*/
import type {SkilltreeFile} from '../types';

/**
 * Load the default example trees packaged in public/examples.
 * Returns an array of SkilltreeFile objects in fixed order.
 */
export async function loadExampleTrees(): Promise<SkilltreeFile[]> {
    const names = ['Combat', 'Utility', 'PvP', 'Ride', 'Farm'];
    const base = import.meta.env.BASE_URL ?? '/';
    return await Promise.all(
        names.map(n => fetch(`${base}examples/${n}.st.json`).then(r => r.json()))
    );
}

/**
 * Download a single JSON file with the provided filename and data.
 * - Pretty prints with two-space indentation for readability.
 */
export function downloadJSON(filename: string, data: unknown) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

/**
 * Read user-selected .json files (supports multi-file). Non-json file names are skipped.
 * Returns the parsed SkilltreeFile array in the same order as provided by FileList.
 */
export async function readDroppedFiles(fileList: FileList): Promise<SkilltreeFile[]> {
    const out: SkilltreeFile[] = [];
    for (const f of Array.from(fileList)) {
        if (!f.name.endsWith('.json')) continue;
        const text = await f.text();
        out.push(JSON.parse(text));
    }
    return out;
}