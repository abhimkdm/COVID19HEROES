//Store Custom Vision data in model
let model;
$(document).ready(async function () {
  $(".progress-bar").show();
  console.log("Loading model...");
  //Load Custom Vision Model Exported For TensorFlow
  model = await tf.loadGraphModel("model/model.json");
  console.log("Model loaded.");
  $(".progress-bar").hide();
});

//Image Avatar
$("#image-selector").change(function () {
  let reader = new FileReader();
  reader.onload = function () {
    let dataURL = reader.result;
    $("#selected-image").attr("src", dataURL);
    $("#prediction-list").empty();
    $("#preLoader").show();
  };

  let file = $("#image-selector").prop("files")[0];
  reader.readAsDataURL(file);
});

//Process Model with Uploaded Image
$("#predict-button").click(async function () {
  $("#preLoader").show();
  let image = $("#selected-image").get(0);

  // Pre-process the image
  console.log("Loading image...");
  let tensor = tf.browser
    .fromPixels(image, 3)
    .resizeNearestNeighbor([224, 224]) // change the image size
    .expandDims()
    .toFloat()
    .reverse(-1); // RGB -> BGR
  let predictions = await model.predict(tensor).data();
  console.log(predictions);
  let top5 = Array.from(predictions)
    .map(function (p, i) {
      // this is Array.map
      return {
        probability: p,
        className: TARGET_TAGS[i], // we are selecting the value from the obj
      };
    })
    .sort(function (a, b) {
      return b.probability - a.probability;
    })
    .slice(0, 3);

  $("#prediction-list").empty();
  setTimeout(function () {
    $("#preLoader").hide();
    top5.forEach(function (p) {
      $("#prediction-list").append(
        `<li class="list-group-item list-group-item-action w-50">
            <div class="d-flex justify-content-between">
            <h5 class="mb-1 text-danger">${p.className}</h5>
            </div>
            <p class="mb-1">${p.probability.toFixed(6)}</p>
          </li>`
      );
    });
  }, 2000);
});
