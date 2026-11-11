# Contrast — room concepts

Measured on the production build with Chrome at 1440 × 900 (reduced motion on, so nothing is mid-animation), for every concept and accent option, in these states: the room, a hovered and a focused hotspot, list view (including a pressed skill chip), and the System Explorer with a node selected. Each row is one text colour on one background colour, as painted (semi-transparent colours are blended over what is behind them). Required ratio: 4.5:1, or 3:1 for large text (24 px, or 18.66 px bold). Text inside the aria-hidden drawing and hero decoration is listed but exempt as decorative; the same content is available as real text in the panels and list view.

## Summary

| Concept | Accent | Hex | Lowest required pair | Required pairs | Failing |
| --- | --- | --- | --- | --- | --- |
| 1. Isometric | Lamp amber | `#FFB547` | 6.99:1 | 18 | 0 |
| 1. Isometric | Redline | `#FF7A68` | 5.00:1 | 18 | 0 |
| 1. Isometric | Greenline | `#8EE3B8` | 6.99:1 | 18 | 0 |
| 2. Elevation | Amber LED | `#FFB547` | 7.10:1 | 14 | 0 |
| 2. Elevation | Green LED | `#5CF29E` | 7.10:1 | 14 | 0 |
| 2. Elevation | Blue LED | `#7DA8FF` | 6.69:1 | 14 | 0 |
| 4. Exploded | Kapton amber | `#FFB547` | 6.97:1 | 15 | 0 |
| 4. Exploded | Copper | `#E8957A` | 6.30:1 | 15 | 0 |
| 4. Exploded | Steel | `#93B7DD` | 6.97:1 | 15 | 0 |

## 1. Isometric — Lamp amber `#FFB547`

Lowest ratio for required text: **6.99:1**. Failing pairs: **0**.

| Text | Background | Ratio | Needs | Pass | Where | Examples |
| --- | --- | --- | --- | --- | --- | --- |
| `#A8C3DE` | `#11335B` | 6.99:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 10 nodes · Node 3 of 10 |
| `#FFB547` | `#11335B` | 7.25:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 01 |
| `#A8C3DE` | `#0E2A4D` | 7.91:1 | 4.5:1 | ✅ | list view; list view (chip pressed) | Enterprise CRM Platform · CRM auth and RBAC · Planned |
| `#A8C3DE` | `#0E2A4D` | 7.91:1 | exempt | — | list view; list view (chip pressed) | 02 · 03 · 04 |
| `#FFB547` | `#0E2A4D` | 8.20:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Full Stack .NET Software Engineer · View as list · View as room |
| `#A8C3DE` | `#0A2240` | 8.76:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Interactive portfolio · Illustrated engineer's room. Each labele · Live link coming soon |
| `#FFB547` | `#0A2240` | 9.08:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Get in touch |
| `#A8C3DE` | `#061A30` | 9.62:1 | 4.5:1 | ✅ | room; room (hover); room (focus); System Explorer (node selected) | Bookshelf · Project frame · Filing cabinet |
| `#1F1404` | `#FFB547` | 10.30:1 | 4.5:1 | ✅ | room; room (hover); room (focus); list view; System Explorer (node selected) | System Explorer · Desk monitor · Skills |
| `#A8C3DE` | `#040D17` | 10.72:1 | 4.5:1 | ✅ | System Explorer (node selected) | Enterprise CRM Platform · CRM auth and RBAC · Planned |
| `#A8C3DE` | `#040D17` | 10.72:1 | exempt | — | System Explorer (node selected) | 02 · 03 · 04 |
| `#FFDDA8` | `#0E2A4D` | 11.09:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | ::before $ |
| `#EAF4FF` | `#11335B` | 11.45:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | CRM request lifecycle · C# · .NET 8 |
| `#EAF4FF` | `#0E2A4D` | 12.96:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Skip to content · Backend-led full-stack engineer building · One flow is mapped so far. The other nin |
| `#EAF4FF` | `#0E2A4D` | 12.96:1 | 3:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Satyendra Varma Nadimpalli · System Explorer · CRM request lifecycle |
| `#0A2240` | `#EAF4FF` | 14.35:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Engineer’s Room · Redis |
| `#EAF4FF` | `#0A2240` | 14.35:1 | exempt | — | room; System Explorer (node selected) | C# · React · Jenkins |
| `#EAF4FF` | `#0A2240` | 14.35:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | Enterprise CRM Platform · Multi-tenant enterprise CRM built with . · Secure JWT and RBAC authorization |
| `#EAF4FF` | `#061A30` | 15.76:1 | 4.5:1 | ✅ | room; room (hover); room (focus); System Explorer (node selected) | Skills · Projects · Experience |
| `#EAF4FF` | `#040D17` | 17.56:1 | 4.5:1 | ✅ | System Explorer (node selected) | One flow is mapped so far. The other nin · View as list |
| `#EAF4FF` | `#040D17` | 17.56:1 | 3:1 | ✅ | System Explorer (node selected) | CRM request lifecycle |

## 1. Isometric — Redline `#FF7A68`

Lowest ratio for required text: **5.00:1**. Failing pairs: **0**.

| Text | Background | Ratio | Needs | Pass | Where | Examples |
| --- | --- | --- | --- | --- | --- | --- |
| `#FF7A68` | `#11335B` | 5.00:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 01 |
| `#FF7A68` | `#0E2A4D` | 5.65:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Full Stack .NET Software Engineer · View as list · View as room |
| `#FF7A68` | `#0A2240` | 6.26:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Get in touch |
| `#A8C3DE` | `#11335B` | 6.99:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 10 nodes · Node 3 of 10 |
| `#2A0B06` | `#FF7A68` | 7.17:1 | 4.5:1 | ✅ | room; room (hover); room (focus); list view; System Explorer (node selected) | System Explorer · Desk monitor · Skills |
| `#A8C3DE` | `#0E2A4D` | 7.91:1 | 4.5:1 | ✅ | list view; list view (chip pressed) | Enterprise CRM Platform · CRM auth and RBAC · Planned |
| `#A8C3DE` | `#0E2A4D` | 7.91:1 | exempt | — | list view; list view (chip pressed) | 02 · 03 · 04 |
| `#A8C3DE` | `#0A2240` | 8.76:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Interactive portfolio · Illustrated engineer's room. Each labele · Live link coming soon |
| `#A8C3DE` | `#061A30` | 9.62:1 | 4.5:1 | ✅ | room; room (hover); room (focus); System Explorer (node selected) | Bookshelf · Project frame · Filing cabinet |
| `#FFC9C0` | `#0E2A4D` | 9.86:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | ::before $ |
| `#A8C3DE` | `#040D17` | 10.72:1 | 4.5:1 | ✅ | System Explorer (node selected) | Enterprise CRM Platform · CRM auth and RBAC · Planned |
| `#A8C3DE` | `#040D17` | 10.72:1 | exempt | — | System Explorer (node selected) | 02 · 03 · 04 |
| `#EAF4FF` | `#11335B` | 11.45:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | CRM request lifecycle · C# · .NET 8 |
| `#EAF4FF` | `#0E2A4D` | 12.96:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Skip to content · Backend-led full-stack engineer building · One flow is mapped so far. The other nin |
| `#EAF4FF` | `#0E2A4D` | 12.96:1 | 3:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Satyendra Varma Nadimpalli · System Explorer · CRM request lifecycle |
| `#0A2240` | `#EAF4FF` | 14.35:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Engineer’s Room · Redis |
| `#EAF4FF` | `#0A2240` | 14.35:1 | exempt | — | room; System Explorer (node selected) | C# · React · Jenkins |
| `#EAF4FF` | `#0A2240` | 14.35:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | Enterprise CRM Platform · Multi-tenant enterprise CRM built with . · Secure JWT and RBAC authorization |
| `#EAF4FF` | `#061A30` | 15.76:1 | 4.5:1 | ✅ | room; room (hover); room (focus); System Explorer (node selected) | Skills · Projects · Experience |
| `#EAF4FF` | `#040D17` | 17.56:1 | 4.5:1 | ✅ | System Explorer (node selected) | One flow is mapped so far. The other nin · View as list |
| `#EAF4FF` | `#040D17` | 17.56:1 | 3:1 | ✅ | System Explorer (node selected) | CRM request lifecycle |

## 1. Isometric — Greenline `#8EE3B8`

Lowest ratio for required text: **6.99:1**. Failing pairs: **0**.

| Text | Background | Ratio | Needs | Pass | Where | Examples |
| --- | --- | --- | --- | --- | --- | --- |
| `#A8C3DE` | `#11335B` | 6.99:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 10 nodes · Node 3 of 10 |
| `#A8C3DE` | `#0E2A4D` | 7.91:1 | 4.5:1 | ✅ | list view; list view (chip pressed) | Enterprise CRM Platform · CRM auth and RBAC · Planned |
| `#A8C3DE` | `#0E2A4D` | 7.91:1 | exempt | — | list view; list view (chip pressed) | 02 · 03 · 04 |
| `#8EE3B8` | `#11335B` | 8.39:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 01 |
| `#A8C3DE` | `#0A2240` | 8.76:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Interactive portfolio · Illustrated engineer's room. Each labele · Live link coming soon |
| `#8EE3B8` | `#0E2A4D` | 9.49:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Full Stack .NET Software Engineer · View as list · View as room |
| `#A8C3DE` | `#061A30` | 9.62:1 | 4.5:1 | ✅ | room; room (hover); room (focus); System Explorer (node selected) | Bookshelf · Project frame · Filing cabinet |
| `#8EE3B8` | `#0A2240` | 10.51:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Get in touch |
| `#A8C3DE` | `#040D17` | 10.72:1 | 4.5:1 | ✅ | System Explorer (node selected) | Enterprise CRM Platform · CRM auth and RBAC · Planned |
| `#A8C3DE` | `#040D17` | 10.72:1 | exempt | — | System Explorer (node selected) | 02 · 03 · 04 |
| `#062214` | `#8EE3B8` | 11.09:1 | 4.5:1 | ✅ | room; room (hover); room (focus); list view; System Explorer (node selected) | System Explorer · Desk monitor · Skills |
| `#EAF4FF` | `#11335B` | 11.45:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | CRM request lifecycle · C# · .NET 8 |
| `#C8F2DC` | `#0E2A4D` | 11.80:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | ::before $ |
| `#EAF4FF` | `#0E2A4D` | 12.96:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Skip to content · Backend-led full-stack engineer building · One flow is mapped so far. The other nin |
| `#EAF4FF` | `#0E2A4D` | 12.96:1 | 3:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Satyendra Varma Nadimpalli · System Explorer · CRM request lifecycle |
| `#0A2240` | `#EAF4FF` | 14.35:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Engineer’s Room · Redis |
| `#EAF4FF` | `#0A2240` | 14.35:1 | exempt | — | room; System Explorer (node selected) | C# · React · Jenkins |
| `#EAF4FF` | `#0A2240` | 14.35:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | Enterprise CRM Platform · Multi-tenant enterprise CRM built with . · Secure JWT and RBAC authorization |
| `#EAF4FF` | `#061A30` | 15.76:1 | 4.5:1 | ✅ | room; room (hover); room (focus); System Explorer (node selected) | Skills · Projects · Experience |
| `#EAF4FF` | `#040D17` | 17.56:1 | 4.5:1 | ✅ | System Explorer (node selected) | One flow is mapped so far. The other nin · View as list |
| `#EAF4FF` | `#040D17` | 17.56:1 | 3:1 | ✅ | System Explorer (node selected) | CRM request lifecycle |

## 2. Elevation — Amber LED `#FFB547`

Lowest ratio for required text: **7.10:1**. Failing pairs: **0**.

| Text | Background | Ratio | Needs | Pass | Where | Examples |
| --- | --- | --- | --- | --- | --- | --- |
| `#B5ADA1` | `#1F232A` | 7.10:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 10 nodes · Node 3 of 10 |
| `#B5ADA1` | `#171A1F` | 7.85:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | Enterprise CRM Platform · CRM auth and RBAC · Planned |
| `#B5ADA1` | `#171A1F` | 7.85:1 | exempt | — | list view; list view (chip pressed); System Explorer (node selected) | 02 · 03 · 04 |
| `#B5ADA1` | `#0F1114` | 8.52:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Interactive portfolio · Illustrated engineer's room. Each labele · Live link coming soon |
| `#B5ADA1` | `#0A0B0D` | 8.87:1 | 4.5:1 | ✅ | room; room (hover); room (focus); System Explorer (node selected) | Bookshelf · Project frame · Filing cabinet |
| `#FFB547` | `#1F232A` | 8.97:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 01 |
| `#1F1404` | `#FFB547` | 10.30:1 | 4.5:1 | ✅ | room; room (hover); room (focus); list view; System Explorer (node selected) | System Explorer · Desk monitor · Skills |
| `#FFB547` | `#0F1114` | 10.76:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Get in touch · Full Stack .NET Software Engineer · View as list |
| `#F3EFE8` | `#1F232A` | 13.75:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | CRM request lifecycle · C# · .NET 8 |
| `#F3EFE8` | `#171A1F` | 15.22:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Skip to content · One flow is mapped so far. The other nin · View as diagram |
| `#F3EFE8` | `#171A1F` | 15.22:1 | 3:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | System Explorer · CRM request lifecycle · Skills |
| `#0F1114` | `#F3EFE8` | 16.50:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Engineer’s Room · Redis |
| `#F3EFE8` | `#0F1114` | 16.50:1 | exempt | — | room; list view; list view (chip pressed); System Explorer (node selected) | ROOM_01 / 4.20 m · // scale 1:40 · C# |
| `#F3EFE8` | `#0F1114` | 16.50:1 | 3:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Satyendra Varma Nadimpalli |
| `#F3EFE8` | `#0F1114` | 16.50:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Backend-led full-stack engineer building · Enterprise CRM Platform · Multi-tenant enterprise CRM built with . |
| `#F3EFE8` | `#0A0B0D` | 17.18:1 | 4.5:1 | ✅ | room; room (hover); room (focus); System Explorer (node selected) | Skills · Projects · Experience |

## 2. Elevation — Green LED `#5CF29E`

Lowest ratio for required text: **7.10:1**. Failing pairs: **0**.

| Text | Background | Ratio | Needs | Pass | Where | Examples |
| --- | --- | --- | --- | --- | --- | --- |
| `#B5ADA1` | `#1F232A` | 7.10:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 10 nodes · Node 3 of 10 |
| `#B5ADA1` | `#171A1F` | 7.85:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | Enterprise CRM Platform · CRM auth and RBAC · Planned |
| `#B5ADA1` | `#171A1F` | 7.85:1 | exempt | — | list view; list view (chip pressed); System Explorer (node selected) | 02 · 03 · 04 |
| `#B5ADA1` | `#0F1114` | 8.52:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Interactive portfolio · Illustrated engineer's room. Each labele · Live link coming soon |
| `#B5ADA1` | `#0A0B0D` | 8.87:1 | 4.5:1 | ✅ | room; room (hover); room (focus); System Explorer (node selected) | Bookshelf · Project frame · Filing cabinet |
| `#5CF29E` | `#1F232A` | 11.00:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 01 |
| `#03200F` | `#5CF29E` | 12.03:1 | 4.5:1 | ✅ | room; room (hover); room (focus); list view; System Explorer (node selected) | System Explorer · Desk monitor · Skills |
| `#5CF29E` | `#0F1114` | 13.19:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Get in touch · Full Stack .NET Software Engineer · View as list |
| `#F3EFE8` | `#1F232A` | 13.75:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | CRM request lifecycle · C# · .NET 8 |
| `#F3EFE8` | `#171A1F` | 15.22:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Skip to content · One flow is mapped so far. The other nin · View as diagram |
| `#F3EFE8` | `#171A1F` | 15.22:1 | 3:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | System Explorer · CRM request lifecycle · Skills |
| `#0F1114` | `#F3EFE8` | 16.50:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Engineer’s Room · Redis |
| `#F3EFE8` | `#0F1114` | 16.50:1 | exempt | — | room; list view; list view (chip pressed); System Explorer (node selected) | ROOM_01 / 4.20 m · // scale 1:40 · C# |
| `#F3EFE8` | `#0F1114` | 16.50:1 | 3:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Satyendra Varma Nadimpalli |
| `#F3EFE8` | `#0F1114` | 16.50:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Backend-led full-stack engineer building · Enterprise CRM Platform · Multi-tenant enterprise CRM built with . |
| `#F3EFE8` | `#0A0B0D` | 17.18:1 | 4.5:1 | ✅ | room; room (hover); room (focus); System Explorer (node selected) | Skills · Projects · Experience |

## 2. Elevation — Blue LED `#7DA8FF`

Lowest ratio for required text: **6.69:1**. Failing pairs: **0**.

| Text | Background | Ratio | Needs | Pass | Where | Examples |
| --- | --- | --- | --- | --- | --- | --- |
| `#7DA8FF` | `#1F232A` | 6.69:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 01 |
| `#B5ADA1` | `#1F232A` | 7.10:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 10 nodes · Node 3 of 10 |
| `#06142E` | `#7DA8FF` | 7.77:1 | 4.5:1 | ✅ | room; room (hover); room (focus); list view; System Explorer (node selected) | System Explorer · Desk monitor · Skills |
| `#B5ADA1` | `#171A1F` | 7.85:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | Enterprise CRM Platform · CRM auth and RBAC · Planned |
| `#B5ADA1` | `#171A1F` | 7.85:1 | exempt | — | list view; list view (chip pressed); System Explorer (node selected) | 02 · 03 · 04 |
| `#7DA8FF` | `#0F1114` | 8.03:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Get in touch · Full Stack .NET Software Engineer · View as list |
| `#B5ADA1` | `#0F1114` | 8.52:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Interactive portfolio · Illustrated engineer's room. Each labele · Live link coming soon |
| `#B5ADA1` | `#0A0B0D` | 8.87:1 | 4.5:1 | ✅ | room; room (hover); room (focus); System Explorer (node selected) | Bookshelf · Project frame · Filing cabinet |
| `#F3EFE8` | `#1F232A` | 13.75:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | CRM request lifecycle · C# · .NET 8 |
| `#F3EFE8` | `#171A1F` | 15.22:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Skip to content · One flow is mapped so far. The other nin · View as diagram |
| `#F3EFE8` | `#171A1F` | 15.22:1 | 3:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | System Explorer · CRM request lifecycle · Skills |
| `#0F1114` | `#F3EFE8` | 16.50:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Engineer’s Room · Redis |
| `#F3EFE8` | `#0F1114` | 16.50:1 | exempt | — | room; list view; list view (chip pressed); System Explorer (node selected) | ROOM_01 / 4.20 m · // scale 1:40 · C# |
| `#F3EFE8` | `#0F1114` | 16.50:1 | 3:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Satyendra Varma Nadimpalli |
| `#F3EFE8` | `#0F1114` | 16.50:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Backend-led full-stack engineer building · Enterprise CRM Platform · Multi-tenant enterprise CRM built with . |
| `#F3EFE8` | `#0A0B0D` | 17.18:1 | 4.5:1 | ✅ | room; room (hover); room (focus); System Explorer (node selected) | Skills · Projects · Experience |

## 4. Exploded — Kapton amber `#FFB547`

Lowest ratio for required text: **6.97:1**. Failing pairs: **0**.

| Text | Background | Ratio | Needs | Pass | Where | Examples |
| --- | --- | --- | --- | --- | --- | --- |
| `#B8B2A8` | `#2A2826` | 6.97:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 10 nodes · Node 3 of 10 |
| `#B8B2A8` | `#22211F` | 7.64:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | Enterprise CRM Platform · CRM auth and RBAC · Planned |
| `#B8B2A8` | `#22211F` | 7.64:1 | exempt | — | list view; list view (chip pressed); System Explorer (node selected) | 02 · 03 · 04 |
| `#B8B2A8` | `#1A1918` | 8.34:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Interactive portfolio · Backend-led full-stack engineer building · Illustrated engineer's room. Each labele |
| `#FFB547` | `#2A2826` | 8.36:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 01 |
| `#B8B2A8` | `#121110` | 8.96:1 | 4.5:1 | ✅ | room; room (hover); room (focus); System Explorer (node selected) | Bookshelf · Project frame · Filing cabinet |
| `#FFB547` | `#1A1918` | 9.99:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Get in touch · Full Stack .NET Software Engineer |
| `#1F1404` | `#FFB547` | 10.30:1 | 4.5:1 | ✅ | room; room (hover); room (focus); list view; list view (chip pressed); System Explorer (node selected) | Engineer’s Room · System Explorer · Desk monitor |
| `#F4F1EB` | `#2A2826` | 13.03:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | View as room · CRM request lifecycle · C# |
| `#FFDDA8` | `#1A1918` | 13.51:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | ::before $ |
| `#F4F1EB` | `#22211F` | 14.27:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Skip to content · One flow is mapped so far. The other nin · View as diagram |
| `#F4F1EB` | `#22211F` | 14.27:1 | 3:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | System Explorer · CRM request lifecycle · Skills |
| `#F4F1EB` | `#1A1918` | 15.57:1 | exempt | — | room; list view; list view (chip pressed); System Explorer (node selected) | Satyendra Varma Nadimpalli |
| `#F4F1EB` | `#1A1918` | 15.57:1 | 3:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Satyendra Varma Nadimpalli |
| `#F4F1EB` | `#1A1918` | 15.57:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | View as list · Enterprise CRM Platform · Multi-tenant enterprise CRM built with . |
| `#F4F1EB` | `#1A1918` | 15.57:1 | exempt | — | room; System Explorer (node selected) | ROOM_01 / 4.20 m · // scale 1:40 · C# |
| `#1A1918` | `#F4F1EB` | 15.57:1 | 4.5:1 | ✅ | list view (chip pressed) | Redis |
| `#F4F1EB` | `#121110` | 16.73:1 | 4.5:1 | ✅ | room; room (hover); room (focus); System Explorer (node selected) | Skills · Projects · Experience |

## 4. Exploded — Copper `#E8957A`

Lowest ratio for required text: **6.30:1**. Failing pairs: **0**.

| Text | Background | Ratio | Needs | Pass | Where | Examples |
| --- | --- | --- | --- | --- | --- | --- |
| `#E8957A` | `#2A2826` | 6.30:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 01 |
| `#B8B2A8` | `#2A2826` | 6.97:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 10 nodes · Node 3 of 10 |
| `#E8957A` | `#1A1918` | 7.53:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Get in touch · Full Stack .NET Software Engineer |
| `#2A120A` | `#E8957A` | 7.58:1 | 4.5:1 | ✅ | room; room (hover); room (focus); list view; list view (chip pressed); System Explorer (node selected) | Engineer’s Room · System Explorer · Desk monitor |
| `#B8B2A8` | `#22211F` | 7.64:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | Enterprise CRM Platform · CRM auth and RBAC · Planned |
| `#B8B2A8` | `#22211F` | 7.64:1 | exempt | — | list view; list view (chip pressed); System Explorer (node selected) | 02 · 03 · 04 |
| `#B8B2A8` | `#1A1918` | 8.34:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Interactive portfolio · Backend-led full-stack engineer building · Illustrated engineer's room. Each labele |
| `#B8B2A8` | `#121110` | 8.96:1 | 4.5:1 | ✅ | room; room (hover); room (focus); System Explorer (node selected) | Bookshelf · Project frame · Filing cabinet |
| `#F6CDBF` | `#1A1918` | 12.04:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | ::before $ |
| `#F4F1EB` | `#2A2826` | 13.03:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | View as room · CRM request lifecycle · C# |
| `#F4F1EB` | `#22211F` | 14.27:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Skip to content · One flow is mapped so far. The other nin · View as diagram |
| `#F4F1EB` | `#22211F` | 14.27:1 | 3:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | System Explorer · CRM request lifecycle · Skills |
| `#F4F1EB` | `#1A1918` | 15.57:1 | exempt | — | room; list view; list view (chip pressed); System Explorer (node selected) | Satyendra Varma Nadimpalli |
| `#F4F1EB` | `#1A1918` | 15.57:1 | 3:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Satyendra Varma Nadimpalli |
| `#F4F1EB` | `#1A1918` | 15.57:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | View as list · Enterprise CRM Platform · Multi-tenant enterprise CRM built with . |
| `#F4F1EB` | `#1A1918` | 15.57:1 | exempt | — | room; System Explorer (node selected) | ROOM_01 / 4.20 m · // scale 1:40 · C# |
| `#1A1918` | `#F4F1EB` | 15.57:1 | 4.5:1 | ✅ | list view (chip pressed) | Redis |
| `#F4F1EB` | `#121110` | 16.73:1 | 4.5:1 | ✅ | room; room (hover); room (focus); System Explorer (node selected) | Skills · Projects · Experience |

## 4. Exploded — Steel `#93B7DD`

Lowest ratio for required text: **6.97:1**. Failing pairs: **0**.

| Text | Background | Ratio | Needs | Pass | Where | Examples |
| --- | --- | --- | --- | --- | --- | --- |
| `#B8B2A8` | `#2A2826` | 6.97:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 10 nodes · Node 3 of 10 |
| `#93B7DD` | `#2A2826` | 7.03:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 01 |
| `#B8B2A8` | `#22211F` | 7.64:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | Enterprise CRM Platform · CRM auth and RBAC · Planned |
| `#B8B2A8` | `#22211F` | 7.64:1 | exempt | — | list view; list view (chip pressed); System Explorer (node selected) | 02 · 03 · 04 |
| `#B8B2A8` | `#1A1918` | 8.34:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Interactive portfolio · Backend-led full-stack engineer building · Illustrated engineer's room. Each labele |
| `#93B7DD` | `#1A1918` | 8.41:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Get in touch · Full Stack .NET Software Engineer |
| `#0A1726` | `#93B7DD` | 8.65:1 | 4.5:1 | ✅ | room; room (hover); room (focus); list view; list view (chip pressed); System Explorer (node selected) | Engineer’s Room · System Explorer · Desk monitor |
| `#B8B2A8` | `#121110` | 8.96:1 | 4.5:1 | ✅ | room; room (hover); room (focus); System Explorer (node selected) | Bookshelf · Project frame · Filing cabinet |
| `#F4F1EB` | `#2A2826` | 13.03:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | View as room · CRM request lifecycle · C# |
| `#CFE0F2` | `#1A1918` | 13.04:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | ::before $ |
| `#F4F1EB` | `#22211F` | 14.27:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Skip to content · One flow is mapped so far. The other nin · View as diagram |
| `#F4F1EB` | `#22211F` | 14.27:1 | 3:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | System Explorer · CRM request lifecycle · Skills |
| `#F4F1EB` | `#1A1918` | 15.57:1 | exempt | — | room; list view; list view (chip pressed); System Explorer (node selected) | Satyendra Varma Nadimpalli |
| `#F4F1EB` | `#1A1918` | 15.57:1 | 3:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Satyendra Varma Nadimpalli |
| `#F4F1EB` | `#1A1918` | 15.57:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | View as list · Enterprise CRM Platform · Multi-tenant enterprise CRM built with . |
| `#F4F1EB` | `#1A1918` | 15.57:1 | exempt | — | room; System Explorer (node selected) | ROOM_01 / 4.20 m · // scale 1:40 · C# |
| `#1A1918` | `#F4F1EB` | 15.57:1 | 4.5:1 | ✅ | list view (chip pressed) | Redis |
| `#F4F1EB` | `#121110` | 16.73:1 | 4.5:1 | ✅ | room; room (hover); room (focus); System Explorer (node selected) | Skills · Projects · Experience |

## Comparison dock (shared by all concepts; removed with the comparison page)

Lowest ratio: **8.71:1**. Failing pairs: **0**.

| Text | Background | Ratio | Needs | Pass | Examples |
| --- | --- | --- | --- | --- | --- |
| `#B4BEC9` | `#1A2027` | 8.71:1 | 4.5:1 | ✅ | Isometric blueprint · Scanline sweep · #FFB547 |
| `#B4BEC9` | `#05080C` | 10.65:1 | 4.5:1 | ✅ | Front elevation · Terminal typing · Exploded axonometric · Packet stream · #FF7A68 |
| `#F2F5F8` | `#1A2027` | 15.00:1 | 4.5:1 | ✅ | 1. Isometric · Lamp amber |
| `#F2F5F8` | `#05080C` | 18.34:1 | 4.5:1 | ✅ | 2. Elevation · 4. Exploded · Redline |
