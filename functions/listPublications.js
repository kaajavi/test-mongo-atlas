// This function is the endpoint's request handler.
exports = async function(payload, response) {
    // Raw request body (if the client sent one).
    // This is a binary object that can be accessed as a string using .text()
    const {filter, course, material, page, pager} = payload.query;


    const db = context.services.get("AgComments").db("material_contributions");
    const collection = db.collection(`contributions_${course}_${material}`);
  
    
    // Parámetros de paginación
    const limit = parseInt(pager) || 10; // Número fijo de documentos por página
    const skip = (parseInt(page) - 1) * parseInt(limit) || 0;

    // Crear una consulta con ordenación y paginación
    const query = {};
    let sort = {};
    switch (filter) {
        case "top":
            sort = { "starredByLength": -1 }; // Ordenar por los más votados (mayor longitud de starred_by)
            break;
        case "unanswered":
            sort = { "answersLength": 1 }; // Ordenar por los que tienen menos respuestas (menor longitud de answers)
            break;
        default:
            sort = { "created_at": -1 }; // Orden por defecto
    }

    // Ejecutar la consulta
    const totalPages = await collection.count(query) / limit;
    
    
    let pipeline = [
        {
            $addFields: {
                answersLength: { $size: "$answers" },
                starredByLength: { $size: "$starred_by" }
            }
        },
        // Ordenar basado en el filtro
        { $sort: sort },
        // Paginación
        { $skip: skip },
        { $limit: limit }
    ];

    // Ejecutar la consulta de agregación
    const comments = await collection.aggregate(pipeline).toArray();
    
    //const comments = await collection.find(query).sort(sort).skip(skip).limit(limit).toArray();

    // Preparar la respuesta
    const responseData = {
        data: comments,
        metadata: {
            totalPages: totalPages,
            current_page: page,
            current_limit: limit
        }
    };

    // Establecer la respuesta
    response.setStatusCode(200); // Código de estado HTTP para "OK"
    response.setBody(JSON.stringify(responseData));
    return response
    
};
