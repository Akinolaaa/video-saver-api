const express = require('express');
const fs = require('fs');
const Video = require('./db/Video');
const cloudinary = require('cloudinary').v2;

const router = express.Router();

router.route('/')
  .get(async (req, res) => {
    const videos = await Video.find({});
    res.status(200).json({ videos })
  })
  .post(async (req, res) => {
    const video = req.files?.video;
    //check if video exists
    if (!video){
      return res.status(400).json({ error: 'video missing from request'})
    }
    const isVideoFormat = video.mimetype.startsWith('video/');
    // check format
    if( !isVideoFormat) {
      return res.status(400).json({ error: 'file type gotten is not a video'})
    };
    const MAXSIZE = 100 * 1048576; 
    if(video.size >= MAXSIZE){
      return res.status(400).json({ error: 'video too large. should be <100MB'})
    }
    const result = await cloudinary.uploader.upload(video.tempFilePath, {
      use_filename: true,
      resource_type: "video",
      folder: 'hng',
    });
    const videoInDB = await Video.create({
      url: result.url,
      download_url: result.playback_url,
    })
    fs.unlinkSync(video.tempFilePath);
    return res.status(201).json({ video: videoInDB })
  });

router.route('/:id')
  .get(async (req, res) => {
    const video = await Video.findOne({ _id: req.params.id});
    res.status(200).json({video})
  })

module.exports = router;