// This function is the endpoint's request handler.
exports = function(payload, response) {

    // Data can be extracted from the request as follows:
    const responseData = {};
    const user_id = payload.headers["x-us"] || 0;
    if (user_id === 0){
        responseData.error = 'Not Authorized'
        response.setStatusCode(401);
        response.setBody(JSON.stringify(responseData));
        return response
    }
    // Raw request body (if the client sent one).
    // This is a binary object that can be accessed as a string using .text()
    const {course, material, object_type, is_question, content, parent_id} = payload.body;

    const newComment = {
      user_id: user_id,
      is_question: true ? is_question : false, // tipo de contribución, p.ej., "comment"
      active: true, // estado activo del comentario
      content: content, // contenido del comentario
      answers: [], // lista inicial de respuestas (vacía)
      starred_by: [user_id], // lista inicial de "likes" (vacía)
      created_at: new Date(), // fecha de creación
      updated_at: new Date() // fecha de última actualización
    };

    const db = context.services.get("AgComments").db("material_contributions");
    const doc = db.collection(`contributions_${course}_${material}`);
    has_parent = parent_id ? true : false
    if (has_parent){
        //find parent and insert new answer on answer array
        doc.updateOne({_id: BSON.ObjectId(parent_id)}, {$push: {answers: newComment}})
    }else{
        doc.insertOne(newComment)
    }



    // Establecer la respuesta
    response.setStatusCode(200); // Código de estado HTTP para "OK"
    response.setBody(JSON.stringify(responseData));
    return response
};
