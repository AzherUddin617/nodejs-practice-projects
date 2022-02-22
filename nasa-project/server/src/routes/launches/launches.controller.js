const { getAllLaunches, addNewLaunches, abortLaunchById, launchExistWithId, } = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
    res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
    const launch = req.body;
    console.log(req.body)

    if (!launch.mission || !launch.rocket || !launch.target || !launch.launchDate) {
        return res.status(400).json({
            error: "Missing required launch property",
            launch: launch
        });
    }

    launch.launchDate = new Date(launch.launchDate);

    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: "Invalid launch date",
        });
    }

    addNewLaunches(launch);
    return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
    const id = Number(req.params.id);

    if (!launchExistWithId(id)) {
        return res.status(404).json({
            error: "Launch to found"
        });
    }

    const aborted = abortLaunchById(id);
    res.status(200).json(aborted);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}