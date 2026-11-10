# Contrast — room variants

Measured on the production build with Chrome at 1440 × 900 (reduced motion on, so nothing is mid-animation), in four states: room, list view (including a pressed skill chip), and the System Explorer with a node selected. Each row is one text colour on one background colour, as painted (semi-transparent colours are blended over what is behind them). Required ratio: 4.5:1, or 3:1 for large text (24 px, or 18.66 px bold). Decorative drawing text inside the aria-hidden illustration is listed but exempt as incidental.

## 1. Isometric — accent `#5CE1F2`, idle: Scanline sweep

Lowest ratio for required text: **6.99:1**. Failing pairs: **0**.

| Text | Background | Ratio | Needs | Pass | Where | Examples |
| --- | --- | --- | --- | --- | --- | --- |
| `#A8C3DE` | `#11335B` | 6.99:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 10 nodes · Node 3 of 10 |
| `#A8C3DE` | `#0E2A4D` | 7.91:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | Enterprise CRM Platform · CRM auth and RBAC · Planned |
| `#A8C3DE` | `#0E2A4D` | 7.91:1 | exempt | — | list view; list view (chip pressed); System Explorer (node selected) | 02 · 03 · 04 |
| `#5CE1F2` | `#11335B` | 8.19:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 01 |
| `#A8C3DE` | `#0A2240` | 8.76:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Interactive portfolio · Illustrated engineer's room. Each labele · Live link coming soon |
| `#5CE1F2` | `#0E2A4D` | 9.27:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Full Stack .NET Software Engineer · View as list · View as room |
| `#A8C3DE` | `#061A30` | 9.62:1 | 4.5:1 | ✅ | room; room (hover); System Explorer (node selected) | Bookshelf · Project frame · Filing cabinet |
| `#FFD37A` | `#0E2A4D` | 10.19:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | ::before $ |
| `#5CE1F2` | `#0A2240` | 10.27:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Get in touch |
| `#04222E` | `#5CE1F2` | 10.61:1 | 4.5:1 | ✅ | room; room (hover); list view; System Explorer (node selected) | System Explorer · Desk monitor · Skills |
| `#EAF4FF` | `#11335B` | 11.45:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | CRM request lifecycle · C# · .NET 8 |
| `#EAF4FF` | `#0E2A4D` | 12.96:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Skip to content · Backend-led full-stack engineer building · One flow is mapped so far. The other nin |
| `#EAF4FF` | `#0E2A4D` | 12.96:1 | 3:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Satyendra Varma Nadimpalli · System Explorer · CRM request lifecycle |
| `#0A2240` | `#EAF4FF` | 14.35:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Engineer’s Room · Redis |
| `#EAF4FF` | `#0A2240` | 14.35:1 | exempt | — | room; System Explorer (node selected) | ROOM_01 / 4.20 m · // scale 1:40 |
| `#EAF4FF` | `#0A2240` | 14.35:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | Enterprise CRM Platform · Multi-tenant enterprise CRM built with . · Secure JWT and RBAC authorization |
| `#EAF4FF` | `#061A30` | 15.76:1 | 4.5:1 | ✅ | room; room (hover); System Explorer (node selected) | Skills · Projects · Experience |

## 2. Elevation — accent `#FFB547`, idle: Terminal typing

Lowest ratio for required text: **7.10:1**. Failing pairs: **0**.

| Text | Background | Ratio | Needs | Pass | Where | Examples |
| --- | --- | --- | --- | --- | --- | --- |
| `#B5ADA1` | `#1F232A` | 7.10:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 10 nodes · Node 3 of 10 |
| `#B5ADA1` | `#171A1F` | 7.85:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | Enterprise CRM Platform · CRM auth and RBAC · Planned |
| `#B5ADA1` | `#171A1F` | 7.85:1 | exempt | — | list view; list view (chip pressed); System Explorer (node selected) | 02 · 03 · 04 |
| `#B5ADA1` | `#0F1114` | 8.52:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Interactive portfolio · Illustrated engineer's room. Each labele · Live link coming soon |
| `#B5ADA1` | `#0A0B0D` | 8.87:1 | 4.5:1 | ✅ | room; room (hover); System Explorer (node selected) | Bookshelf · Project frame · Filing cabinet |
| `#FFB547` | `#1F232A` | 8.97:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 01 |
| `#1C1203` | `#FFB547` | 10.51:1 | 4.5:1 | ✅ | room; room (hover); list view; System Explorer (node selected) | System Explorer · Desk monitor · Skills |
| `#FFB547` | `#0F1114` | 10.76:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Get in touch · Full Stack .NET Software Engineer · View as list |
| `#F3EFE8` | `#1F232A` | 13.75:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | CRM request lifecycle · C# · .NET 8 |
| `#F3EFE8` | `#171A1F` | 15.22:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Skip to content · One flow is mapped so far. The other nin · View as diagram |
| `#F3EFE8` | `#171A1F` | 15.22:1 | 3:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | System Explorer · CRM request lifecycle · Skills |
| `#0F1114` | `#F3EFE8` | 16.50:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Engineer’s Room · Redis |
| `#F3EFE8` | `#0F1114` | 16.50:1 | 3:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Satyendra Varma Nadimpalli |
| `#F3EFE8` | `#0F1114` | 16.50:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Backend-led full-stack engineer building · Enterprise CRM Platform · Multi-tenant enterprise CRM built with . |
| `#F3EFE8` | `#0F1114` | 16.50:1 | exempt | — | room; System Explorer (node selected) | ROOM_01 / 4.20 m · // scale 1:40 · > dotnet run |
| `#F3EFE8` | `#0A0B0D` | 17.18:1 | 4.5:1 | ✅ | room; room (hover); System Explorer (node selected) | Skills · Projects · Experience |

## 3. Plan — accent `#B6F25A`, idle: Radar sweep

Lowest ratio for required text: **8.30:1**. Failing pairs: **0**.

| Text | Background | Ratio | Needs | Pass | Where | Examples |
| --- | --- | --- | --- | --- | --- | --- |
| `#9FC8B3` | `#0F2A20` | 8.30:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 10 nodes · Node 3 of 10 |
| `#9FC8B3` | `#0B2018` | 9.23:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | Enterprise CRM Platform · CRM auth and RBAC · Planned |
| `#9FC8B3` | `#0B2018` | 9.23:1 | exempt | — | list view; list view (chip pressed); System Explorer (node selected) | 02 · 03 · 04 |
| `#9FC8B3` | `#06140F` | 10.22:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Interactive portfolio · Backend-led full-stack engineer building · Illustrated engineer's room. Each labele |
| `#9FC8B3` | `#03100A` | 10.52:1 | 4.5:1 | ✅ | room; room (hover); System Explorer (node selected) | Bookshelf · Project frame · Filing cabinet |
| `#B6F25A` | `#0F2A20` | 11.54:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 01 |
| `#FFD166` | `#06140F` | 13.07:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | ::before $ |
| `#0C1A04` | `#B6F25A` | 13.59:1 | 4.5:1 | ✅ | room; room (hover); System Explorer (node selected) | System Explorer · Desk monitor · Skills |
| `#B6F25A` | `#06140F` | 14.21:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Get in touch · Full Stack .NET Software Engineer |
| `#E8FFF2` | `#0F2A20` | 14.59:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | View as room · CRM request lifecycle · C# |
| `#E8FFF2` | `#0B2018` | 16.22:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Skip to content · One flow is mapped so far. The other nin · View as diagram |
| `#E8FFF2` | `#0B2018` | 16.22:1 | 3:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | System Explorer · CRM request lifecycle · Skills |
| `#06140F` | `#E8FFF2` | 17.96:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Engineer’s Room · Redis |
| `#E8FFF2` | `#06140F` | 17.96:1 | 3:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Satyendra Varma Nadimpalli |
| `#E8FFF2` | `#06140F` | 17.96:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | View as list · Enterprise CRM Platform · Multi-tenant enterprise CRM built with . |
| `#E8FFF2` | `#06140F` | 17.96:1 | exempt | — | room; System Explorer (node selected) | ROOM_01 / 4.20 m · // scale 1:40 · > dotnet run |
| `#E8FFF2` | `#03100A` | 18.49:1 | 4.5:1 | ✅ | room; room (hover); System Explorer (node selected) | Skills · Projects · Experience |

## 4. Exploded — accent `#C69CFF`, idle: Packet stream

Lowest ratio for required text: **7.66:1**. Failing pairs: **0**.

| Text | Background | Ratio | Needs | Pass | Where | Examples |
| --- | --- | --- | --- | --- | --- | --- |
| `#C69CFF` | `#1D1742` | 7.66:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 01 |
| `#B9B0DD` | `#1D1742` | 8.23:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | 10 nodes · Node 3 of 10 |
| `#170A2C` | `#C69CFF` | 8.60:1 | 4.5:1 | ✅ | room; room (hover); list view; list view (chip pressed); System Explorer (node selected) | Engineer’s Room · System Explorer · Desk monitor |
| `#C69CFF` | `#0E0B20` | 8.83:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Get in touch · Full Stack .NET Software Engineer |
| `#B9B0DD` | `#161132` | 8.89:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | Enterprise CRM Platform · CRM auth and RBAC · Planned |
| `#B9B0DD` | `#161132` | 8.89:1 | exempt | — | list view; list view (chip pressed); System Explorer (node selected) | 02 · 03 · 04 |
| `#B9B0DD` | `#0E0B20` | 9.49:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Interactive portfolio · Backend-led full-stack engineer building · Illustrated engineer's room. Each labele |
| `#B9B0DD` | `#090717` | 9.78:1 | 4.5:1 | ✅ | room; room (hover); System Explorer (node selected) | Bookshelf · Project frame · Filing cabinet |
| `#5EEAD4` | `#0E0B20` | 13.05:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | ::before $ |
| `#F2EDFF` | `#1D1742` | 14.63:1 | 4.5:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | View as room · CRM request lifecycle · C# |
| `#F2EDFF` | `#161132` | 15.80:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Skip to content · One flow is mapped so far. The other nin · View as diagram |
| `#F2EDFF` | `#161132` | 15.80:1 | 3:1 | ✅ | list view; list view (chip pressed); System Explorer (node selected) | System Explorer · CRM request lifecycle · Skills |
| `#F2EDFF` | `#0E0B20` | 16.86:1 | 3:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | Satyendra Varma Nadimpalli |
| `#F2EDFF` | `#0E0B20` | 16.86:1 | 4.5:1 | ✅ | room; list view; list view (chip pressed); System Explorer (node selected) | View as list · Enterprise CRM Platform · Multi-tenant enterprise CRM built with . |
| `#F2EDFF` | `#0E0B20` | 16.86:1 | exempt | — | room; System Explorer (node selected) | ROOM_01 / 4.20 m · // scale 1:40 · > dotnet run |
| `#0E0B20` | `#F2EDFF` | 16.86:1 | 4.5:1 | ✅ | list view (chip pressed) | Redis |
| `#F2EDFF` | `#090717` | 17.39:1 | 4.5:1 | ✅ | room; room (hover); System Explorer (node selected) | Skills · Projects · Experience |

## Comparison dock (shared by all four; removed with the comparison page)

Lowest ratio: **8.71:1**. Failing pairs: **0**.

| Text | Background | Ratio | Needs | Pass | Examples |
| --- | --- | --- | --- | --- | --- |
| `#B4BEC9` | `#1A2027` | 8.71:1 | 4.5:1 | ✅ | #5CE1F2 · Scanline sweep |
| `#B4BEC9` | `#05080C` | 10.65:1 | 4.5:1 | ✅ | #FFB547 · Terminal typing · #B6F25A · Radar sweep · #C69CFF · Packet stream |
| `#F2F5F8` | `#1A2027` | 15.00:1 | 4.5:1 | ✅ | 1. Isometric |
| `#F2F5F8` | `#05080C` | 18.34:1 | 4.5:1 | ✅ | 2. Elevation · 3. Plan · 4. Exploded |
