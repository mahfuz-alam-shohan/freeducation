# The content API

Everything this site shows comes from one API. This document is generated from the
site's own contracts, so it is always what the code really requests — if it says a
field exists, the site reads that field.

## How it is called

Every request carries:

| Header | Value |
|---|---|
| `accept` | `application/json` |
| `x-api-key` | the school's key, from `CONTENT_API_KEY` |
| `x-tenant` | the school identifier, when one is configured |

Paths below are relative to the configured base URL. A `404` is read as "this does
not exist" and renders an empty state; any other non-2xx is an error. Requests time
out after 8 seconds.

Lists are always paginated and must answer with
`{ items, page, pageSize, total }`.

## Reading content

### `site.profile`

`GET site/profile`

Parameters: _none_

Example response:

```json
{
  "name": {
    "bn": "আদর্শ স্কুল অ্যান্ড কলেজ",
    "en": "Adarsha School & College"
  },
  "shortName": {
    "bn": "আদর্শ",
    "en": "Adarsha"
  },
  "tagline": {
    "bn": "জ্ঞানই আলো",
    "en": "Knowledge is light"
  },
  "eiin": "108573",
  "established": "1965",
  "logo": {
    "url": "/sample/crest.svg",
    "width": 64,
    "height": 64,
    "variants": []
  },
  "cover": {
    "url": "/sample/hero.jpg",
    "width": 1600,
    "height": 900,
    "variants": []
  },
  "address": {
    "bn": "১২ কলেজ রোড, ধানমন্ডি, ঢাকা ১২০৫",
    "en": "12 College Road, Dhanmondi, Dhaka 1205"
  },
  "phones": [
    "+880 2 9876543",
    "+880 1711 223344"
  ],
  "emails": [
    "info@adarsha.edu.bd"
  ],
  "social": {
    "facebook": "https://facebook.com/example",
    "youtube": "https://youtube.com/@example"
  }
}
```

### `site.navigation`

`GET site/navigation`

Parameters: _none_

Example response:

```json
{
  "primary": [
    {
      "id": "home",
      "label": {
        "bn": "হোম",
        "en": "Home"
      },
      "path": "",
      "view": "home",
      "params": {},
      "visible": true,
      "highlighted": false,
      "children": []
    },
    {
      "id": "about",
      "label": {
        "bn": "পরিচিতি",
        "en": "About"
      },
      "path": "about",
      "view": "rich-page",
      "params": {},
      "visible": true,
      "highlighted": false,
      "children": [
        {
          "id": "about-glance",
          "label": {
            "bn": "এক নজরে",
            "en": "At a Glance"
          },
          "path": "about",
          "view": "rich-page",
          "params": {},
          "visible": true,
          "highlighted": false,
          "children": []
        },
        {
          "id": "about-history",
          "label": {
            "bn": "ইতিহাস",
            "en": "History"
          },
          "path": "about/history",
          "view": "rich-page",
          "params": {},
          "visible": true,
          "highlighted": false,
          "children": []
        }
      ]
    }
  ],
  "utility": [
    {
      "id": "search",
      "label": {
        "bn": "খুঁজুন",
        "en": "Search"
      },
      "path": "search",
      "view": "search",
      "params": {},
      "visible": false,
      "highlighted": false,
      "children": []
    },
    {
      "id": "login",
      "label": {
        "bn": "লগইন",
        "en": "Login"
      },
      "path": "login",
      "view": "external-link",
      "params": {},
      "visible": true,
      "highlighted": false,
      "externalUrl": "#",
      "children": []
    }
  ],
  "footer": [
    {
      "id": "f-notice",
      "label": {
        "bn": "নোটিশ",
        "en": "Notice"
      },
      "path": "notice",
      "view": "notice-list",
      "params": {},
      "visible": true,
      "highlighted": false,
      "children": []
    },
    {
      "id": "f-admission",
      "label": {
        "bn": "ভর্তি",
        "en": "Admission"
      },
      "path": "admission",
      "view": "rich-page",
      "params": {},
      "visible": true,
      "highlighted": false,
      "children": []
    }
  ]
}
```

### `site.stats`

`GET site/stats`

Parameters: _none_

Example response:

```json
[
  {
    "label": {
      "bn": "শিক্ষার্থী",
      "en": "Students"
    },
    "value": "4,200"
  },
  {
    "label": {
      "bn": "শিক্ষক",
      "en": "Teachers"
    },
    "value": "145"
  }
]
```

### `notice.list`

`GET notices`

Parameters: `category` _(optional)_, `page` _(optional)_, `pageSize` _(optional)_

Example response:

```json
{
  "items": [
    {
      "id": "n2",
      "slug": "half-yearly-routine",
      "title": {
        "bn": "অর্ধবার্ষিক পরীক্ষার রুটিন প্রকাশ",
        "en": "Half-yearly examination routine published"
      },
      "summary": {
        "bn": "পরীক্ষা শুরু ২০ জুন, সকাল ১০টা।",
        "en": "Examinations begin on 20 June at 10am."
      },
      "category": "academic",
      "publishedAt": "2026-05-28T04:00:00.000Z",
      "pinned": true,
      "attachments": [
        {
          "label": {
            "bn": "পরীক্ষার রুটিন",
            "en": "Examination routine"
          },
          "url": "#",
          "mimeType": "application/pdf"
        }
      ]
    },
    {
      "id": "n1",
      "slug": "admission-2026",
      "title": {
        "bn": "২০২৬ শিক্ষাবর্ষে একাদশ শ্রেণিতে ভর্তি বিজ্ঞপ্তি",
        "en": "Class XI admission notice for the 2026 session"
      },
      "summary": {
        "bn": "অনলাইনে আবেদন শুরু ১০ জানুয়ারি, শেষ তারিখ ৩১ জানুয়ারি।",
        "en": "Online applications open on 10 January and close on 31 January."
      },
      "body": {
        "bn": "<p>বিজ্ঞান, ব্যবসায় শিক্ষা ও মানবিক — তিনটি শাখাতেই ভর্তি চলবে। বিস্তারিত সময়সূচি ও আসনসংখ্যা সংযুক্ত বিজ্ঞপ্তিতে দেওয়া আছে।</p><p>ভর্তি সংক্রান্ত যেকোনো জিজ্ঞাসার জন্য কলেজ অফিসে যোগাযোগ করুন।</p>",
        "en": "<p>Admission is open in all three groups — Science, Business Studies and Humanities. The full schedule and seat numbers are in the attached circular.</p><p>For any question about admission, please contact the college office.</p>"
      },
      "category": "admission",
      "publishedAt": "2026-01-05T04:00:00.000Z",
      "pinned": true,
      "attachments": [
        {
          "label": {
            "bn": "ভর্তি বিজ্ঞপ্তি",
            "en": "Admission circular"
          },
          "url": "#",
          "mimeType": "application/pdf"
        },
        {
          "label": {
            "bn": "আসন বিন্যাস",
            "en": "Seat plan"
          },
          "url": "#",
          "mimeType": "application/pdf"
        }
      ]
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 12
}
```

### `notice.bySlug`

`GET notices/:slug`

Parameters: `slug` **(required)**

Example response:

```json
{
  "id": "n1",
  "slug": "admission-2026",
  "title": {
    "bn": "২০২৬ শিক্ষাবর্ষে একাদশ শ্রেণিতে ভর্তি বিজ্ঞপ্তি",
    "en": "Class XI admission notice for the 2026 session"
  },
  "summary": {
    "bn": "অনলাইনে আবেদন শুরু ১০ জানুয়ারি, শেষ তারিখ ৩১ জানুয়ারি।",
    "en": "Online applications open on 10 January and close on 31 January."
  },
  "body": {
    "bn": "<p>বিজ্ঞান, ব্যবসায় শিক্ষা ও মানবিক — তিনটি শাখাতেই ভর্তি চলবে। বিস্তারিত সময়সূচি ও আসনসংখ্যা সংযুক্ত বিজ্ঞপ্তিতে দেওয়া আছে।</p><p>ভর্তি সংক্রান্ত যেকোনো জিজ্ঞাসার জন্য কলেজ অফিসে যোগাযোগ করুন।</p>",
    "en": "<p>Admission is open in all three groups — Science, Business Studies and Humanities. The full schedule and seat numbers are in the attached circular.</p><p>For any question about admission, please contact the college office.</p>"
  },
  "category": "admission",
  "publishedAt": "2026-01-05T04:00:00.000Z",
  "pinned": true,
  "attachments": [
    {
      "label": {
        "bn": "ভর্তি বিজ্ঞপ্তি",
        "en": "Admission circular"
      },
      "url": "#",
      "mimeType": "application/pdf"
    },
    {
      "label": {
        "bn": "আসন বিন্যাস",
        "en": "Seat plan"
      },
      "url": "#",
      "mimeType": "application/pdf"
    }
  ]
}
```

### `page.bySlug`

`GET pages/:slug`

Parameters: `slug` **(required)**

Example response:

```json
{
  "slug": "about",
  "title": {
    "bn": "এক নজরে",
    "en": "At a Glance"
  },
  "updatedAt": "2026-02-01T00:00:00.000Z",
  "blocks": [
    {
      "type": "richtext",
      "html": {
        "bn": "<p>১৯৬৫ সালে প্রতিষ্ঠিত আদর্শ স্কুল অ্যান্ড কলেজ ঢাকার অন্যতম প্রাচীন শিক্ষাপ্রতিষ্ঠান। ষষ্ঠ শ্রেণি থেকে দ্বাদশ শ্রেণি পর্যন্ত বিজ্ঞান, ব্যবসায় শিক্ষা ও মানবিক — তিনটি শাখায় পাঠদান করা হয়।</p>",
        "en": "<p>Founded in 1965, Adarsha School &amp; College is among the oldest institutions in Dhaka. It teaches from Class Six to Class Twelve across three groups: Science, Business Studies and Humanities.</p>"
      }
    },
    {
      "type": "table",
      "rows": [
        [
          {
            "bn": "বিষয়",
            "en": "Field"
          },
          {
            "bn": "তথ্য",
            "en": "Detail"
          }
        ],
        [
          {
            "bn": "ইআইআইএন",
            "en": "EIIN"
          },
          {
            "bn": "১০৮৫৭৩",
            "en": "108573"
          }
        ]
      ],
      "header": true
    }
  ]
}
```

### `person.list`

`GET people`

Parameters: `group` _(optional)_, `page` _(optional)_, `pageSize` _(optional)_

Example response:

```json
{
  "items": [
    {
      "id": "t1",
      "name": {
        "bn": "মোঃ আনিসুর রহমান",
        "en": "Md Anisur Rahman"
      },
      "designation": {
        "bn": "অধ্যক্ষ",
        "en": "Principal"
      },
      "group": "teachers",
      "department": {
        "bn": "প্রশাসন",
        "en": "Administration"
      },
      "photo": {
        "url": "/sample/portrait.jpg",
        "width": 560,
        "height": 700,
        "variants": []
      },
      "email": "principal@adarsha.edu.bd",
      "order": 1
    },
    {
      "id": "t2",
      "name": {
        "bn": "ড. সাবরিনা চৌধুরী",
        "en": "Dr Sabrina Chowdhury"
      },
      "designation": {
        "bn": "উপাধ্যক্ষ",
        "en": "Vice Principal"
      },
      "group": "teachers",
      "department": {
        "bn": "প্রশাসন",
        "en": "Administration"
      },
      "photo": {
        "url": "/sample/portrait.jpg",
        "width": 560,
        "height": 700,
        "variants": []
      },
      "order": 2
    }
  ],
  "page": 1,
  "pageSize": 50,
  "total": 12
}
```

### `event.list`

`GET events`

Parameters: `from` _(optional)_, `to` _(optional)_, `page` _(optional)_, `pageSize` _(optional)_

Example response:

```json
{
  "items": [
    {
      "id": "e6",
      "slug": "guardians-meeting-september",
      "title": {
        "bn": "অভিভাবক সমাবেশ",
        "en": "Guardians’ meeting"
      },
      "startsAt": "2026-09-05T05:00:00.000Z",
      "location": {
        "bn": "কলেজ মিলনায়তন",
        "en": "College auditorium"
      }
    },
    {
      "id": "e7",
      "slug": "class-nine-orientation",
      "title": {
        "bn": "নবম শ্রেণির ওরিয়েন্টেশন",
        "en": "Class Nine orientation"
      },
      "startsAt": "2026-09-16T04:00:00.000Z",
      "location": {
        "bn": "২০১ নম্বর কক্ষ",
        "en": "Room 201"
      }
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 8
}
```

### `event.bySlug`

`GET events/:slug`

Parameters: `slug` **(required)**

Example response:

```json
{
  "id": "e1",
  "slug": "annual-sports-2026",
  "title": {
    "bn": "বার্ষিক ক্রীড়া প্রতিযোগিতা",
    "en": "Annual Sports Day"
  },
  "description": {
    "bn": "<p>সকাল ৮টা থেকে দিনব্যাপী।</p>",
    "en": "<p>All day, starting at 8am.</p>"
  },
  "startsAt": "2026-12-18T03:00:00.000Z",
  "location": {
    "bn": "কলেজ মাঠ",
    "en": "College ground"
  },
  "cover": {
    "url": "/sample/plate-5.jpg",
    "width": 900,
    "height": 620,
    "variants": []
  }
}
```

### `gallery.albums`

`GET gallery/albums`

Parameters: `page` _(optional)_, `pageSize` _(optional)_

Example response:

```json
{
  "items": [
    {
      "id": "a1",
      "slug": "annual-sports-2026",
      "title": {
        "bn": "বার্ষিক ক্রীড়া ২০২৬",
        "en": "Annual Sports 2026"
      },
      "cover": {
        "url": "/sample/plate-1.jpg",
        "width": 900,
        "height": 620,
        "variants": []
      },
      "photos": [
        {
          "url": "/sample/plate-1.jpg",
          "alt": {
            "bn": "উদ্বোধনী কুচকাওয়াজ",
            "en": "The opening parade"
          },
          "width": 900,
          "height": 620,
          "variants": []
        },
        {
          "url": "/sample/plate-3.jpg",
          "alt": {
            "bn": "দৌড় প্রতিযোগিতা",
            "en": "The sprint race"
          },
          "width": 900,
          "height": 620,
          "variants": []
        }
      ],
      "takenAt": "2026-12-18T00:00:00.000Z"
    },
    {
      "id": "a3",
      "slug": "victory-day-2026",
      "title": {
        "bn": "বিজয় দিবস ২০২৬",
        "en": "Victory Day 2026"
      },
      "cover": {
        "url": "/sample/plate-3.jpg",
        "width": 900,
        "height": 620,
        "variants": []
      },
      "photos": [
        {
          "url": "/sample/plate-3.jpg",
          "alt": {
            "bn": "পুষ্পস্তবক অর্পণ",
            "en": "Laying of flowers"
          },
          "width": 900,
          "height": 620,
          "variants": []
        }
      ],
      "takenAt": "2026-12-16T00:00:00.000Z"
    }
  ],
  "page": 1,
  "pageSize": 24,
  "total": 3
}
```

### `gallery.album`

`GET gallery/albums/:slug`

Parameters: `slug` **(required)**

Example response:

```json
{
  "id": "a1",
  "slug": "annual-sports-2026",
  "title": {
    "bn": "বার্ষিক ক্রীড়া ২০২৬",
    "en": "Annual Sports 2026"
  },
  "cover": {
    "url": "/sample/plate-1.jpg",
    "width": 900,
    "height": 620,
    "variants": []
  },
  "photos": [
    {
      "url": "/sample/plate-1.jpg",
      "alt": {
        "bn": "উদ্বোধনী কুচকাওয়াজ",
        "en": "The opening parade"
      },
      "width": 900,
      "height": 620,
      "variants": []
    },
    {
      "url": "/sample/plate-3.jpg",
      "alt": {
        "bn": "দৌড় প্রতিযোগিতা",
        "en": "The sprint race"
      },
      "width": 900,
      "height": 620,
      "variants": []
    }
  ],
  "takenAt": "2026-12-18T00:00:00.000Z"
}
```

### `video.list`

`GET gallery/videos`

Parameters: `page` _(optional)_, `pageSize` _(optional)_

Example response:

```json
{
  "items": [
    {
      "id": "v1",
      "slug": "annual-sports-highlights",
      "title": {
        "bn": "বার্ষিক ক্রীড়া প্রতিযোগিতার ঝলক",
        "en": "Annual Sports Day highlights"
      },
      "description": {
        "bn": "২০২৬ সালের বার্ষিক ক্রীড়া প্রতিযোগিতার সংক্ষিপ্ত ভিডিও।",
        "en": "A short film of the 2026 annual sports day."
      },
      "embedUrl": "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ",
      "watchUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
      "poster": {
        "url": "/sample/video-poster.jpg",
        "width": 960,
        "height": 540,
        "variants": []
      },
      "publishedAt": "2026-12-20T00:00:00.000Z",
      "durationSeconds": 312
    },
    {
      "id": "v2",
      "slug": "science-fair-tour",
      "title": {
        "bn": "বিজ্ঞান মেলা পরিদর্শন",
        "en": "A walk through the science fair"
      },
      "embedUrl": "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ",
      "watchUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
      "poster": {
        "url": "/sample/video-poster.jpg",
        "width": 960,
        "height": 540,
        "variants": []
      },
      "publishedAt": "2026-11-06T00:00:00.000Z",
      "durationSeconds": 486
    }
  ],
  "page": 1,
  "pageSize": 24,
  "total": 3
}
```

### `routine.classes`

`GET routine/classes`

Parameters: _none_

Example response:

```json
[
  {
    "id": "nine",
    "label": {
      "bn": "নবম শ্রেণি",
      "en": "Class Nine"
    }
  },
  {
    "id": "ten",
    "label": {
      "bn": "দশম শ্রেণি",
      "en": "Class Ten"
    }
  }
]
```

### `routine.byClass`

`GET routine`

Parameters: `class` _(optional)_

Example response:

```json
{
  "classRef": {
    "id": "nine",
    "label": {
      "bn": "নবম শ্রেণি",
      "en": "Class Nine"
    }
  },
  "days": [
    {
      "bn": "রবিবার",
      "en": "Sunday"
    },
    {
      "bn": "সোমবার",
      "en": "Monday"
    }
  ],
  "periods": [
    {
      "label": {
        "bn": "১ম",
        "en": "1st"
      },
      "startsAt": "09:00",
      "endsAt": "09:45"
    },
    {
      "label": {
        "bn": "২য়",
        "en": "2nd"
      },
      "startsAt": "09:45",
      "endsAt": "10:30"
    }
  ],
  "grid": [
    [
      {
        "subject": {
          "bn": "বাংলা",
          "en": "Bangla"
        },
        "teacher": {
          "bn": "সেলিনা আক্তার",
          "en": "Selina Akhter"
        },
        "room": "201"
      },
      {
        "subject": {
          "bn": "গণিত",
          "en": "Mathematics"
        },
        "teacher": {
          "bn": "মোঃ শাহজাহান আলী",
          "en": "Md Shahjahan Ali"
        },
        "room": "204"
      }
    ],
    [
      {
        "subject": {
          "bn": "ইংরেজি",
          "en": "English"
        },
        "teacher": {
          "bn": "রুবিনা পারভীন",
          "en": "Rubina Parvin"
        },
        "room": "201"
      },
      null
    ]
  ],
  "updatedAt": "2026-06-01T00:00:00.000Z"
}
```

### `result.exams`

`GET results/exams`

Parameters: _none_

Example response:

```json
[
  {
    "id": "half-yearly-2026",
    "label": {
      "bn": "অর্ধবার্ষিক ২০২৬",
      "en": "Half-yearly 2026"
    }
  },
  {
    "id": "annual-2026",
    "label": {
      "bn": "বার্ষিক ২০২৬",
      "en": "Annual 2026"
    }
  }
]
```

### `result.lookup`

`GET results/lookup`

Parameters: `exam` **(required)**, `roll` **(required)**

Example response:

```json
{
  "roll": "101",
  "studentName": {
    "bn": "তানভীর হাসান",
    "en": "Tanvir Hasan"
  },
  "className": {
    "bn": "নবম শ্রেণি",
    "en": "Class Nine"
  },
  "exam": {
    "bn": "অর্ধবার্ষিক ২০২৬",
    "en": "Half-yearly 2026"
  },
  "gpa": "5.00",
  "subjects": [
    {
      "name": {
        "bn": "বাংলা",
        "en": "Bangla"
      },
      "grade": "A+",
      "points": 5
    },
    {
      "name": {
        "bn": "ইংরেজি",
        "en": "English"
      },
      "grade": "A+",
      "points": 5
    }
  ],
  "publishedAt": "2026-07-10T00:00:00.000Z"
}
```

### `site.search`

`GET search`

Parameters: `q` **(required)**, `page` _(optional)_, `pageSize` _(optional)_

Example response:

```json
{
  "items": [
    {
      "title": {
        "bn": "২০২৬ শিক্ষাবর্ষে একাদশ শ্রেণিতে ভর্তি বিজ্ঞপ্তি",
        "en": "Class XI admission notice for the 2026 session"
      },
      "path": "notice/admission-2026",
      "kind": "notice",
      "snippet": {
        "bn": "অনলাইনে আবেদন শুরু ১০ জানুয়ারি, শেষ তারিখ ৩১ জানুয়ারি।",
        "en": "Online applications open on 10 January and close on 31 January."
      },
      "date": "2026-01-05T04:00:00.000Z"
    },
    {
      "title": {
        "bn": "একাদশ শ্রেণির প্রথম মেধাতালিকা",
        "en": "Class XI first merit list"
      },
      "path": "notice/admission-merit-list",
      "kind": "notice",
      "snippet": {
        "bn": "নির্বাচিত শিক্ষার্থীদের ভর্তি ১২ ফেব্রুয়ারির মধ্যে সম্পন্ন করতে হবে।",
        "en": "Selected students must complete admission by 12 February."
      },
      "date": "2026-02-05T04:00:00.000Z"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 3
}
```

## Receiving submissions

### `contact.message`

`POST forms/contact` with a JSON body

Fields: `name` **(required)**, `email` _(optional)_, `phone` _(optional)_, `subject` **(required)**, `message` **(required)**

Answer with `{ "ok": true, "reference": "ADM-4821" }`. The reference is shown to
the sender so they can quote it to the office.

### `admission.application`

`POST forms/admission` with a JSON body

Fields: `studentName` **(required)**, `guardianName` **(required)**, `phone` **(required)**, `email` _(optional)_, `classApplyingFor` **(required)**, `group` _(optional)_, `dateOfBirth` _(optional)_, `previousSchool` _(optional)_, `address` _(optional)_, `note` _(optional)_

Answer with `{ "ok": true, "reference": "ADM-4821" }`. The reference is shown to
the sender so they can quote it to the office.
