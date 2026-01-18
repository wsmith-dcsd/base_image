import ServiceWrapper, { ServiceOptions } from "../utils/ServiceWrapper";

import {
    USER_ACCESS_CONTROLS,
    USER_ACTIVE_SCHOOL_YEAR,
    USER_ATTRIBUTES_UPDATE,
    USER_INSTRUCTIONAL_AREA,
    USER_DETAILS,
    USER_LOCATION_BY_KEY,
    USER_LOCATION_SEARCHABLE_GET,
    USER_PERMISSIONS,
    USER_SCHOOL_YEAR,
    USER_STUDENT_SEARCHABLE_GET,
    USER_SERVICE,
    USER_SUMMARIES,
    USER_SYNC
} from "../const/UserConst";

interface UserDaoOptions {
    action: string;
    data?: unknown;
    guid?: string | null;
    key?: string | null;
    params?: unknown;
    targetGuid?: string | null;
    token: string;
    tool?: string | null;
    username?: string | null;
    [key: string]: unknown;
}

/**
 * Data Access for the User API
 */
const UserDao = (options: UserDaoOptions): Promise<{ data: unknown }> | null => {
    const { action, data, guid, key, params, targetGuid, token, tool, username } = options;
    const bearer = `Bearer ${token}`;
    const requestOptions: ServiceOptions = {
        url: "",
        method: "GET",
        headers: {
            Authorization: bearer
        }
    };
    const actionConfig: Record<string, Partial<ServiceOptions>> = {
        activeSchoolYearRead: { method: "GET", url: USER_ACTIVE_SCHOOL_YEAR },
        locationByKeyRead: { method: "GET", url: `${USER_LOCATION_BY_KEY}/${key}/index.json` },
        locationsSearchableRead: { method: "GET", url: USER_LOCATION_SEARCHABLE_GET, params },
        schoolYearRead: { method: "GET", url: `${USER_SCHOOL_YEAR}/${key}/detail.json` },
        schoolYearsRead: { method: "GET", url: `${USER_SCHOOL_YEAR}/index.json` },
        userAccessRead: { method: "GET", url: `${USER_ACCESS_CONTROLS}/${guid}/${targetGuid}/detail.json` },
        userAttributesUpdate: { method: "PUT", url: `${USER_ATTRIBUTES_UPDATE}/${guid}/index.json`, data },
        userDetailsRead: { method: "GET", url: `${USER_SERVICE}/${username}/details.json` },
        userDetailsByGuidRead: { method: "GET", url: `${USER_SERVICE}/guid/${guid}/details.json` },
        userInstructionalAreaRead: { method: "GET", url: `${USER_INSTRUCTIONAL_AREA}/${guid}/index.json` },
        userPermissionsRead: { method: "GET", url: `${USER_PERMISSIONS}/${guid}/${tool?.toUpperCase()}/detail.json` },
        userSearchableStudentsRead: { method: "GET", url: `${USER_STUDENT_SEARCHABLE_GET}/index.json`, params },
        userSummariesRead: { method: "GET", url: USER_SUMMARIES, params },
        usersByGuidRead: { method: "GET", url: USER_DETAILS, params },
        userSync: { method: "GET", url: `${USER_SYNC}/${username}/details.json` }
    };

    const config = actionConfig[action];
    if (!config) {
        return null;
    }

    return ServiceWrapper.serviceCall({
        options: {
            ...requestOptions,
            ...config
        }
    });
};

export default UserDao;
