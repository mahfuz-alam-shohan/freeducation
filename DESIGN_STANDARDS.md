# Freeducation Design Standards

This document captures UI standards for the public-facing experience so future updates maintain the established visual system.

## Public Subject Cards (Landing + Subject Index)

- **Poster-style layout:** subject cards use a tall, movie-poster aspect ratio thumbnail with the subject name below the thumbnail.
- **Uploaded thumbnails:** thumbnails are uploaded from **Admin → Settings → Thumbnails** and rendered inside the poster frame. Avoid gradients or decorative thumbnail backgrounds.
- **Image fitting:** thumbnails must stay inside the frame with `object-fit: contain`. Use the zoom control (0.8x–1.0x) to fit without cropping.
- **Motion cues:** cards can use gentle floating motion to keep the page lively without distracting from content.
- **Badging:** group and subtitles remain below the thumbnail for clarity.

## Spacing + Density

- **Compact spacing:** reduce excessive vertical gaps; sections use tighter padding and smaller inter-section spacing.
- **Card grids:** keep grid gaps modest (3–4 units) to keep content visually connected.

## Filters (See All)

- **Flatter controls:** group filtering uses a flat select dropdown; search uses a flat input with modest rounding.
- **Minimal chrome:** avoid heavy borders, large pills, or tall controls that disrupt density.

## Color + Motion Accents

- **Color accents:** section labels and subject thumbnails should introduce richer color to the otherwise neutral layout.
- **Scrolling enhancements:** horizontal subject rows are scrollable with snap points for smoother, more intentional browsing.

## Keep Consistency

When adding new subject sections or layouts, follow the same poster-card visual language, spacing rules, and thumbnail upload workflow above.
