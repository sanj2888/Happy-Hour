# Greater Sydney pubs and bars data

Two spreadsheets (CSV files, which open in Excel, Numbers or Google Sheets), last researched 23 October 2026.

## sydney_venues.csv: one row per venue (480 venues)

Built from the 408-entry directory, the venues already in the app, and new venues found during research. Duplicates are merged:
The London and The Golden Barley were listed twice; Felons Barrel Room is part of Felons Manly; Sky Bar, Clocktower Bar and Menzies Bar are all inside Shell House; and 11 directory names match app venues under a slightly different name (for example Red Cow Inn = Red Cow Hotel, The Dog Hotel = The Duke of Gloucester). `directory_ref` shows which directory entry numbers each row came from.

| Column | Meaning |
|---|---|
| region, suburb, address | Where it is. Addresses are filled in where a source gave one. |
| category, description | The type of venue and a short description. |
| operating_status | `Listed as operating (Oct 2026 source)` = a current listing was found. `Could not confirm` = nothing current found. `Not checked` = not researched individually. |
| happy_hour_status | `Yes` = at least one session found. `Not found` = checked and nothing confirmed. `Not checked` = not researched individually. |
| verification_status | `Verified` = from the venue's (or its operator's) own website. `Listed` = from a guide or listing site. |
| notes | Conflicts between sources, name changes, and what the original directory claimed. |
| in_app | Whether the venue was already in the app before this research. |

## sydney_happy_hours.csv: one row per happy-hour session (237 sessions)

Days, start and end times, eligible drinks, advertised prices, whether it's members only, the source link and its type.
`Listed (partial)` means the source didn't state the days or times, so those come from the directory and are not confirmed. These sessions are left out of the app.

Deals change often. Treat `Listed` sessions as a guide and re-check before relying on them.
