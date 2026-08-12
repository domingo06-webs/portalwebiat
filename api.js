// =============================================
// IAT PORTAL API
// Google Apps Script Backend
// =============================================

//const API_URL = 'https://script.google.com/macros/s/AKfycbwG2s3ZeEa0NORzzJDSvCuhzL9j1ssahPFCNzCIeXMSE2jZP2riFnQTnbYawc6vT8YfWQ/exec';


// =============================================
// IAT PORTAL API
// Google Apps Script Backend
// =============================================

const API_URL =
    'https://script.google.com/macros/s/AKfycbwG2s3ZeEa0NORzzJDSvCuhzL9j1ssahPFCNzCIeXMSE2jZP2riFnQTnbYawc6vT8YfWQ/exec';


// =============================================
// GET DATA
// =============================================

async function getAppsFromDatabase() {

    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                'HTTP Error: ' +
                response.status
            );

        }


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message ||
                'Gagal mengambil data'
            );

        }


        console.log(
            'DATA DARI SPREADSHEET:',
            result.data
        );


        return result.data || [];


    } catch (error) {

        console.error(
            'GET APPS ERROR:',
            error
        );

        throw error;

    }

}


// =============================================
// TAMBAH
// =============================================

async function addAppToDatabase(app) {

    return sendRequest(
        'addApp',
        app
    );

}


// =============================================
// UPDATE
// =============================================

async function updateAppToDatabase(app) {

    return sendRequest(
        'updateApp',
        app
    );

}


// =============================================
// DELETE
// =============================================

async function deleteAppFromDatabase(id) {

    return sendRequest(
        'deleteApp',
        {
            id: id
        }
    );

}


// =============================================
// SEND REQUEST
// =============================================

async function sendRequest(
    action,
    data
) {

    try {

        const response =
            await fetch(
                API_URL,
                {

                    method: 'POST',

                    headers: {

                        'Content-Type':
                            'text/plain;charset=utf-8'

                    },

                    body: JSON.stringify({

                        action: action,

                        data: data

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                'HTTP Error: ' +
                response.status
            );

        }


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message ||
                'Request gagal'
            );

        }


        console.log(
            'API RESPONSE:',
            result
        );


        return result;


    } catch (error) {

        console.error(
            'API ERROR:',
            error
        );

        throw error;

    }

}