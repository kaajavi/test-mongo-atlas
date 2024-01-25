// This function is the endpoint's request handler.

exports = function(payload, response) {
    // Data can be extracted from the request as follows:
    const user_id = headers["x-UserId"] || 0;
    if (user_id === 0){
      throw 'Not User'
    }
    console.log('Hello n ' + user_id);

    // Raw request body (if the client sent one).
    // This is a binary object that can be accessed as a string using .text()
    const {course, material, object_type, is_discussion, content, markdown_content, parent_id} = body;

    console.log("course, material: ", course, material);
    console.log("context body:", JSON.stringify(context.values));
    console.log("context body:", JSON.stringify(context.services));
    const newComment = {
      user_id: user_id, // el ID del usuario que hace el comentario
      contribution_type: "discussion" ? is_discussion : "comment", // tipo de contribución, p.ej., "comment"
      reference_id: course, // ID de referencia, p.ej., ID de una clase o curso
      reference_type: "class", // tipo de referencia, p.ej., "class"
      active: true, // estado activo del comentario
      content: "markdown_content", // contenido del comentario
      answers: [], // lista inicial de respuestas (vacía)
      starred_by: [user_id], // lista inicial de "likes" (vacía)
      created_at: new Date(), // fecha de creación
      updated_at: new Date() // fecha de última actualización
    };

    const db = context.services.get("AgComments").db("material_contributions");
    const doc = db.collection(`contributions_${course}_${material}`);
    doc.insertOne(newComment)
    
    // You can use 'context' to interact with other application features.
    // Accessing a value:
    // var x = context.values.get("value_name");

    // Querying a mongodb service:
    // const doc = context.services.get("mongodb-atlas").db("dbname").collection("coll_name").findOne();

    // Calling a function:
    // const result = context.functions.execute("function_name", arg1, arg2);

    // The return value of the function is sent as the response back to the client
    // when the "Respond with Result" setting is set.
    return  {
      "breadcrumb": [],
      "author": {
          "name": "Javier Guignard",
          "avatar": "https://staging.static.platzi.com/static/website/v2/images/avatar_default.afdd5b436fc2.png",
          "role": "Platzi Team"
      },
      "timestamp": "2024-01-25T13:08:15.844496Z",
      "content": "Esto es una prueba",
      "tags": [],
      "objectType": "comment",
      "materialTitle": "",
      "materialUrl": "",
      "id": 5052455,
      "liked": true,
      "nLikes": 1,
      "ai_generated": false,
      "nSubcards": 0,
      "detailUrl": "https://platzi.com/comentario/5052455/",
      "actions": {
          "likeable": true,
          "commentable": true,
          "bookmarkable": false,
          "shareable": true,
          "deletable": true
      },
      "subcards": [],
      "payload": {
          "create": {},
          "delete": {
              "url": "/comments/5052455/delete/",
              "parameters": []
          },
          "like": {}
      }
  };
};
