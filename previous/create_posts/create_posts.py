import json

# via http://spacehack.org/?json=1

with open("old_site.json") as json_file:
    json_data = json.load(json_file)

posts = json_data['posts']

yaml = """
---
layout: page
title:  %s
permalink: /%s/
website: %s
tags:
%s
featured_tags: %s
cats:
%s
old_site_image: %s
status: previous
redirect_from:
  - %s
---

<div class = "scrape-from-old-wordpress">

%s

</div>
""".strip()

list_template = '  - %s'

def remove_non_ascii_2(text):
   return ''.join([i if ord(i) < 128 else ' ' for i in text])

for p in posts:

    title = p['title']
    website = p['url']
    content = remove_non_ascii_2(p['content'])
    tags = "\n".join([list_template % t['title'].strip() for t in p['tags']])
    featured_tags = p['custom_fields']['Featured Tags'][0].strip(',')
    cats = "\n".join([list_template % c['title'].strip() for c in p['categories']])
    status = [s['slug'].strip() for s in p['taxonomy_status']]
    url_slug = p['url'].split('/project/')[1].replace('-','')
    date_str = p['date'].split(' ')[0]

    old_slug = '/project/' + p['url'].split('/project/')[1]

    print old_slug

    # old_site_image
    try:
        img = p['attachments'][0]['images']['full']['url']
    except TypeError:
        try:
            img = p['attachments']['images']['full']['url']
        except TypeError:
            img = ''


    if 'previous' in status:

        markdown = yaml % (title, url_slug, website, tags, featured_tags, cats, img, old_slug, content)

        # filename = "%s-%s.md" % (date_str, url_slug)
        filename = "%s.md" % url_slug

        target = open(filename, 'w')
        target.write(markdown)
        target.close()
