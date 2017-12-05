const _                   = require('lodash');
const CFError             = require('cf-errors');
const { sendHttpRequest } = require('./helper');

const getAll = async () => {
    const options = {
        url: `/api/pipelines`,
        method: 'GET',
    };

    return await sendHttpRequest(options);
};

/**
 * will return all pipelines by repository owner/name
 * @param repoOwner
 * @param repoName
 * @returns {Promise<*>}
 */
const getAllByRepo = async (repoOwner, repoName) => {
    const options = {
        url: `/api/services/${encodeURIComponent(repoOwner)}/${encodeURIComponent(repoName)}`,
        method: 'GET',
    };

    const pipelines = await sendHttpRequest(options);
    _.forEach(pipelines, (pipeline) => {
        delete pipeline.account;
    });
    return pipelines;
};

/**
 * will a pipeline by its name and repository owner/name
 * @param name
 * @param repoOwner
 * @param repoName
 * @returns {Promise<*>}
 */
const getPipelineByNameAndRepo = async (name, repoOwner, repoName) => {
    const pipelines = await getAllByRepo(repoOwner, repoName);
    const pipeline  = _.find(pipelines, { name });
    if (!pipeline) {
        throw new CFError(`Pipeline name: ${name} wasn't found under repository: ${repoOwner}/${repoName}`);
    }
    return pipeline;
};

const getPipelineById = async (id) => {
    const options = {
        url: `/api/pipelines/${id}`,
        method: 'GET',
    };

    return await sendHttpRequest(options);
};

/**
 * will run a pipeline by its id
 * @param id
 * @returns {Promise<*>}
 */
const runPipelineById = async (id, data = {}) => {
    const body = {
        options: {},
    };

    if (data.branch) {
        body.branch = data.branch;
    }

    if (data.envVars) {
        body.variables = data.envVars;
    }

    if (data.noCache) {
        body.options.noCache = data.noCache;
    }

    if (data.resetVolume) {
        body.options.resetVolume = data.resetVolume;
    }

    if (data.sha) {
        body.sha = data.sha;
    }

    const options = {
        url: `/api/builds/${id}`,
        method: 'POST',
        body,
    };

    return await sendHttpRequest(options);
};

/**
 * will update a pipeline with only changes that were passed
 * @param name
 * @param repoOwner
 * @param repoName
 * @returns {Promise<*>}
 */
const patchPipelineById = async (id, pipeline) => {
    const options = {
        url: `/api/pipelines/${id}`,
        method: 'PATCH',
        body: pipeline,
    };

    return await sendHttpRequest(options);
};

const patchPipelineByNameAndRepo = async (name, repoOwner, repoName, pipeline) => {
    const options = {
        url: `/api/services/${encodeURIComponent(repoOwner)}/${encodeURIComponent(repoName)}/${encodeURIComponent(name)}`,
        method: 'PATCH',
        body: pipeline,
    };

    return await sendHttpRequest(options);
};


module.exports = {
    getPipelineByNameAndRepo,
    getAllByRepo,
    runPipelineById,
    patchPipelineById,
    patchPipelineByNameAndRepo,
    getPipelineById,
    getAll,
};