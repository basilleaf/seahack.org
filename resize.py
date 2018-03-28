#! /usr/bin/env python
from shutil import copyfile
import PIL.Image as PIL
import re, os, sys, urlparse
import os

"""

  This is the an image pipeline for creating responsive image sizes.
  To add images to the site, create the square and rectangle images and put them in raw_images/
  then run this script with the project url slug as the first argument.

  For exmaple for spacehack.org/seti do this:

  1. create the square (1200x1200) and rectangle (994x298) images in the raw_images/ directory

  2. Run the script like so:

    python resize.py seti

"""
cwd = os.getcwd()
raw_dir = cwd + '/raw_images/'
image_dir = cwd + '/assets/img/'

all_square_sizes = {
    'xsmall': (450, 450),
    'small': (830, 830),
    'med': (950, 950),
    'large': (1200, 1200),
}

social_size = (1200, 630)

try:
    keyword = sys.argv[1]
except:
    print "You must specify a space probe name \n Or enter 'assets/img' to resize all images"
    exit(0)

JPG = re.compile(".*\.(jpg|jpeg)", re.IGNORECASE)

files = os.listdir(raw_dir)
found_square = False
for raw_file in files:
    if JPG.match(raw_file):  # is this a jpeg
        if keyword in raw_file:  # is our keyword in the filename
            # make the square images for the homepage
            for path, size in all_square_sizes.items():

                if 'square' in raw_file:
                    filename = "%s%s/%s" % (image_dir, path, raw_file)
                    found_square = True
                    img = PIL.open("%s/%s" % (raw_dir, raw_file))
                    img.thumbnail(path, PIL.ANTIALIAS)
                    img.save(filename)
                    print("created: %s" % filename)

            # deal with the project pages
            if 'rectangle' in raw_file:  # is this the rectangle version

                # move rectangle banner image into correct file location:
                filename = "%s%s/%s" % (image_dir, "project_banners", raw_file)
                copyfile("%s/%s" % (raw_dir, raw_file), filename)
                print("created: %s" % filename)

                # make the social images for twitter/facebook sharing
                filename = raw_file.replace('_rectangle','')
                img = PIL.open("%s/%s" % (raw_dir, raw_file))
                orig_width = img.size[0]
                orig_height = img.size[1]
                desired_width = social_size[0]
                desired_height = social_size[1]
                if orig_height <= desired_height:
                    print "Could not create social image, rectangle image must be > %s " % str(desired_height)
                else:
                    img.thumbnail((orig_width, desired_height), PIL.ANTIALIAS)  # adjust the height to the social size first then we'll crop
                    width = img.size[0]
                    height = img.size[1]
                    half_the_width = width / 2
                    half_the_height = height / 2
                    half_desired_width = desired_width / 2
                    half_desired_height = desired_height / 2
                    box = (
                            half_the_width - half_desired_width,
                            half_the_height - half_desired_height,
                            half_the_width + half_desired_width,
                            half_the_height + half_desired_height
                            )

                    img_social = img.crop(box)
                    img_social.save("assets/img/social/%s" % filename)
                    print("created: assets/img/social/%s" % filename)

if not found_square:
    print("could not find a square image for %s" % keyword)
