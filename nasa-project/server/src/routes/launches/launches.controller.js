const { 
    getAllLaunches, 
    scheduleNewLaunch, 
    abortLaunchById, 
    launchExistWithId, 
} = require('../../models/launches.model');
const {
    getPagination,
} = require('../../services/query');

async function httpGetAllLaunches(req, res) {
    const { skip, limit } = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit);
    res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
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

    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
    const id = Number(req.params.id);

    const launchExist = await launchExistWithId(id);
    if (!launchExist) {
        return res.status(404).json({
            error: "Launch to found"
        });
    }

    await abortLaunchById(id);
    res.status(200).json(launchExist);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}