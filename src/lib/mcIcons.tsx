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
  mcIcons.tsx — Runtime item/block icon renderer using mcasset.cloud and MineRender.

  This component decides at runtime whether the provided id should be shown as a
  flat item texture (img) or as a 3D block rendered via MineRender. It consults
  the original JSON models on mcasset.cloud to choose the most accurate path.
*/
import React, { useEffect, useRef, useState } from "react";

import { normId, stripNs } from "./mcUtil";
import { mcAssetsBase } from "./mcAssets";

/**
 * ItemIcon — renders a 24x24 icon for a Minecraft item or block id.
 *
 * Behavior
 * - Attempts to fetch the mcasset.cloud model JSON for the item id. If it is a
 *   simple generated/handheld item, renders the flat PNG texture directly.
 * - If the item model references a block model, or only a block model exists,
 *   uses MineRender to render a tiny 3D block preview in a canvas.
 * - Falls back to attempting the conventional item texture path.
 *
 * Accessibility
 * - The image or canvas container has a title/alt text derived from the id.
 */
export function ItemIcon({
  id,
  alt,
  className,
}: {
  id?: string;
  alt?: string;
  className?: string;
}) {
  const nid = normId(id || undefined);
  const name = nid ? nid.split(":")[1] : "";
  const title = alt ?? (id || "minecraft:item");

  // Decide at runtime whether to render a flat item image or a 3D block
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [renderBlock, setRenderBlock] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Fetch original mcasset.cloud JSON to decide how to render
  useEffect(() => {
    let cancelled = false;
    setImgUrl(null);
    setRenderBlock(false);

    async function resolveKind() {
      if (!name) return;
      // Try item model first
      const itemModelUrl = `${mcAssetsBase()}//assets/minecraft/models/item/${name}.json`;
      try {
        const res = await fetch(itemModelUrl, { mode: 'cors' });
        if (res.ok) {
          const model = await res.json();
          const parent: string = String(model.parent || "");
          // If parent points to an item template (generated/handheld), treat as simple flat item
          const isSimpleItem = parent.startsWith("item/") || parent.includes("item/generated") || parent.includes("item/handheld");
          if (isSimpleItem) {
            const textures = model.textures || {};
            const layer0: string | undefined = textures.layer0 || textures.layer_0 || textures["0"]; // be liberal
            if (layer0) {
              const p = stripNs(layer0);
              const url = `${mcAssetsBase()}//assets/minecraft/textures/${p}.png`;
              if (!cancelled) setImgUrl(url);
              return;
            }
            // If no explicit texture, fall back to conventional item path
            if (!cancelled) setImgUrl(`${mcAssetsBase()}//assets/minecraft/textures/item/${name}.png`);
            return;
          }
          // Otherwise, treat as block-like (item model referencing block parent)
          if (!cancelled) setRenderBlock(true);
          return;
        }
      } catch {}

      // If item model not found or failed, see if a block model exists
      try {
        const res2 = await fetch(`${mcAssetsBase()}//assets/minecraft/models/block/${name}.json`, { mode: 'cors' });
        if (res2.ok) {
          if (!cancelled) setRenderBlock(true);
          return;
        }
      } catch {}

      // Final fallback: try plain item texture; if that 404s we'll leave both null/false
      try {
        const texUrl = `${mcAssetsBase()}//assets/minecraft/textures/item/${name}.png`;
        const head = await fetch(texUrl, { method: 'HEAD', mode: 'cors' });
        if (head.ok) {
          if (!cancelled) setImgUrl(texUrl);
          return;
        }
      } catch {}

      // If nothing worked, leave empty; MineRender of item is a last resort
      if (!cancelled) {
        setRenderBlock(false);
        setImgUrl(null);
      }
    }

    resolveKind();
    return () => { cancelled = true; };
  }, [name, mcAssetsBase()]);

  // Render 3D block when required using MineRender
  useEffect(() => {
    if (!containerRef.current) return;
    // Clear previous content
    containerRef.current.innerHTML = "";

    if (!renderBlock) return; // Only render when we decided it's a block

    const MR: any = (window as any).ModelRender;
    if (!MR) return; // scripts aren't loaded yet

    const options: any = {
      showAxes: false,
      showGrid: false,
      animate: true,
      autoRotate: true,
      autoRotateSpeed: 10,
      controls: {
        enabled: true,
        zoom: false,
        rotate: false,
        pan: false,
      },
      // Inventory-like framing
      shadow: true,
      centerCubes: true,
      fov: 30,
      // Render at higher backing resolution while keeping CSS size 24x24
      antialias: true,
      pixelRatio: 2,
      camera: {
        type: "orthographic",
        x: 12,
        y: 12,
        z: 12,
        target: [0, 0, 0]
      },
      canvas: {
        width: 24,
        height: 24,
      },
      pauseHidden: false,
      background: "00000000",
        assetRoot: mcAssetsBase(),
    };

    const modelRender = new MR(options, containerRef.current);
    try {
      modelRender.render([`block/${name}`]);
    } catch (e) {
      // swallow errors to keep the UI intact
    }

    return () => {
      try {
        if (containerRef.current) containerRef.current.innerHTML = "";
      } catch {}
    };
  }, [renderBlock, name]);

  // If we have an image URL (simple item), render that; otherwise render the canvas container (maybe empty while resolving)
  if (imgUrl) {
    return (
      <img
        src={imgUrl}
        alt={title}
        title={title}
        className={className}
        width={24}
        height={24}
        style={{ width: '24px', height: '24px', display: 'inline-block', verticalAlign: 'middle' }}
        draggable={false}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      title={title}
      className={className}
      style={{ width: '24px', height: '24px', display: 'inline-block', verticalAlign: 'middle' }}
      aria-label={title}
    />
  );
}