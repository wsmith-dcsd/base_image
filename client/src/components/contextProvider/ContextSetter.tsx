import { useGlobalContext } from "./ContextProvider";
import UserDao from "../../dao/UserDao";

/**
 * A collection of context setters
 */

/**
 * SchoolYearPerformance "getter" flags
 */
let getSY = true;
let getAllSY = true;

/**
 * Get all locations and set it in context
 * @name SetLocationDtos
 * @constructor
 */
export const SetAllLocationDtos = (): void => {
    const { dispatch, state } = useGlobalContext();
    const { allLocationDtos, token } = state || {};

    if (token && !allLocationDtos) {
        if (getAllSY) {
            getAllSY = false;
            const options = {
                action: "locationsSearchableRead",
                params: {
                    facetField: "locationType",
                    searchString:
                        "locationType=ELEMENTARY_SCHOOL&locationType=MIDDLE_SCHOOL&locationType=HIGH_SCHOOL&locationType=ALTERNATIVE_SCHOOL&locationType=CHARTER_SCHOOL&locationType=ADMINISTRATIVE",
                    sort: "name",
                    numRows: "1000"
                },
                token
            };
            const promise = UserDao(options);
            if (promise) {
                promise
                    .then((response): void => {
                        if (response) {
                            const { payload } = response.data as { payload: unknown };
                            if (payload) {
                                dispatch({
                                    type: "AllLocationDtos",
                                    allLocationDtos: (payload as { results: unknown[] }).results
                                });
                            }
                        }
                        getAllSY = true;
                    })
                    .catch((): void => {
                        console.error("Failed to fetch location data");
                        getAllSY = true;
                    });
            } else {
                console.error("UserDao returned null or undefined");
                getAllSY = true;
            }
        }
    }
};

/**
 * Get the schoolYearDto and set it in context
 * @name SetSchoolYearDto
 * @constructor
 */
export const SetSchoolYearDto = (): void => {
    const { dispatch, state } = useGlobalContext();
    const { schoolYearDto, token } = state || {};

    if (token && !schoolYearDto) {
        if (getSY) {
            getSY = false;
            const options = {
                action: "activeSchoolYearRead",
                token
            };
            const promise = UserDao(options);
            if (promise) {
                promise
                    .then((response): void => {
                        if (response) {
                            const { payload } = response.data as { payload: unknown };
                            if (payload && typeof payload === "object" && Object.keys(payload).length) {
                                dispatch({
                                    type: "SchoolYearDto",
                                    schoolYearDto: payload
                                });
                            }
                        }
                        getSY = true;
                    })
                    .catch((): void => {
                        console.error("Failed to fetch school year data");
                        getSY = true;
                    });
            } else {
                console.error("UserDao returned null or undefined");
                getSY = true;
            }
        }
    }
};
