function caesarCipherEncrypt(message, geser) {
  var result = "";
  geser = geser % 26;
  for (var i = 0; i < message.length; i++) {
    var char = message[i];
    if (char.match(/[a-zA-Z]/)) {
      var code = message.charCodeAt(i);
      if (char.match(/[A-Z]/)) {
        char = String.fromCharCode(((code - 65 + geser) % 26) + 65);
      } else {
        char = String.fromCharCode(((code - 97 + geser) % 26) + 97);
      }
    }
    result += char;
  }
  return result;
}

function writeIMG() {
  function writefunc() {
    var encryptedMessage = caesarCipherEncrypt(
      $("#msg").val(),
      parseInt($("#shift").val())
    );
    if (
      writeMsgToCanvas("canvas", encryptedMessage, $("#pass").val(), 0) != null
    ) {
      var myCanvas = document.getElementById("canvas");
      var image = myCanvas.toDataURL("image/jpg");
      var element = document.createElement("a");
      element.setAttribute("href", image);
      element.setAttribute("download", "result.jpg");
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  }
  loadIMGtoCanvas("file", "canvas", writefunc, 500);
}

function caesarCipherDecrypt(ciphertext, geser) {
  var plaintext = "";
  geser = geser % 26;
  for (var i = 0; i < ciphertext.length; i++) {
    var char = ciphertext[i];
    if (char.match(/[a-zA-Z]/)) {
      var code = ciphertext.charCodeAt(i);
      if (char.match(/[A-Z]/)) {
        char = String.fromCharCode(((code - 65 - geser + 26) % 26) + 65);
      } else {
        char = String.fromCharCode(((code - 97 - geser + 26) % 26) + 97);
      }
    }
    plaintext += char;
  }
  return plaintext;
}

function readIMG() {
  function readfunc() {
    var t = readMsgFromCanvas("canvas", $("#pass1").val(), 0);
    if (t != null) {
      /*t = t.split("&").join("&amp;");
      t = t.split(" ").join("&nbsp;");
      t = t.split("<").join("&lt;");
      t = t.split(">").join("&gt;");
      t = t.replace(/(?:\r\n|\r|\n)/g, "<br />");*/

      var decryptMsg = caesarCipherDecrypt(t, parseInt($("#shift1").val()));
      $("#result").html(decryptMsg);
    } else $("#result").html("Kesalahan saat ekstrak pesan");
  }
  loadIMGtoCanvas("file1", "canvas", readfunc);
}

//fungsi PSNR TEST
var byteCover = null;
var byteStego = null;
var coverWidth = null;
var coverHeight = null;
var coverHeight = null;
var stegoWidth = null;
var stegoHeight = null;
var stegoSize = null;

function uploadFile() {
  var input = document.getElementById("objFile");
  // var file = $("#objFile")[0].files[0];
  var file = input.files[0];
  fr = new FileReader();
  // fr.onload = receivedText;
  //fr.readAsText(file);
  fr.onload = (function (theFile) {
    return function (e) {
      byteCover = receivedText();
      console.log(byteCover);
      var img = new Image();
      img.src = fr.result;
      img.onload = function () {
        coverSize = file.size;
        coverWidth = img.width;
        coverHeight = img.height;
        console.log("Cover Image : " + coverWidth + "x" + coverHeight);
      };
    };
  })(file);
  fr.readAsDataURL(file);
}

function stegoFile() {
  var input = document.getElementById("file1");
  // var file = $("#objFile")[0].files[0];
  var file = input.files[0];
  fr = new FileReader();
  // fr.onload = receivedText;
  //fr.readAsText(file);
  fr.onload = (function (theFile) {
    return function (e) {
      byteStego = receivedText();
      console.log(byteStego);
      var img = new Image();
      img.src = fr.result;
      img.onload = function () {
        stegoSize = file.size;
        stegoWidth = img.width;
        stegoHeight = img.height;
        console.log("Cover Image : " + stegoWidth + "x" + stegoHeight);
      };
    };
  })(file);
  fr.readAsDataURL(file);
}

function log10(value) {
  return Math.log(value) / Math.LN10;
}
var sumByte = 0;
function getPSNR() {
  var coverLength = byteCover.length;

  // if ((coverHeight*coverWidth) == (stegoHeight*stegoWidth)){
  var i = 0;

  while (i <= coverLength) {
    sumByte = bigInt(
      sumByte + Math.pow(bigInt(byteCover[i]) - bigInt(byteStego[i]), 2)
    );
    i += 1;
  }
  var MSE = bigInt(sumByte) / (coverHeight * coverWidth);
  var PSNR = 10 * log10((255 * 255) / MSE);

  console.log(MSE);
  console.log(PSNR);

  document.getElementById("result").textContent =
    "MSE:" + MSE + "\n" + "PSNR:" + PSNR + "\n";
}
// }

function receivedText() {
  var b64Data = fr.result.split(",");
  var contentType = "image/jpeg";
  //document.getElementById('editor').appendChild(document.createTextNode(fr.result))
  var byteCharacters = atob(b64Data[1]);
  var byteNumbers = Array.prototype.map.call(
    byteCharacters,
    charCodeFromCharacter
  );
  var uint8Data = new Uint8Array(byteNumbers);
  return b64toBlob(b64Data[1], contentType);
  //var blobUrl = URL.createObjectURL(blob);
}

function charCodeFromCharacter(c) {
  return c.charCodeAt(0);
}

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || "";
  sliceSize = sliceSize || 1024;
  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);
    var byteNumbers = Array.prototype.map.call(slice, charCodeFromCharacter);
    var byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  // console.log(byteArray);
  return byteArray;
}

//end of function

$(document).ready(function () {
  $(".content").html(`
        <div class="row justify-content-center mt-4">
        <div class="col-10">
          <div class="form-group">
            <label for="msg">Message : </label>
            <textarea
              class="form-control"
              rows="3"
              id="msg"
              required
            ></textarea>
          </div>
          <div class="form-group">
            <label for="shift">Shift : </label>
            <input type="number" class="form-control" id="shift" required />
          </div>
          <div class="form-group">
            <label for="pass">Key : </label>
            <input type="text" class="form-control" id="pass" required />
          </div>
          <div class="form-group">
            <label for="file">Cover image : </label>
            <input type="file" class="form-control-file" id="file" accept="image/*" />
          </div>
          <button type="button" class="btn btn-primary" onclick="writeIMG()">Embed Message</button>
        </div>
      </div>
        `);

  $(".btn-embed").click(function () {
    $(this).addClass("active-button");
    $(".btn-extract").removeClass("active-button");
    $(".btn-test").removeClass("active-button");
    $(".nav-embed").addClass("active");
    $(".nav-extract").removeClass("active");
    $(".nav-test").removeClass("active");
    $(".content").html(`
      <div class="row justify-content-center mt-4">
      <div class="col-10">
        <div class="form-group">
          <label for="msg">Message : </label>
          <textarea
            class="form-control"
            rows="3"
            id="msg"
            required
          ></textarea>
        </div>
        <div class="form-group">
            <label for="shift">Shift : </label>
            <input type="number" class="form-control" id="shift" required />
          </div>
        <div class="form-group">
          <label for="pass">Key : </label>
          <input type="text" class="form-control" id="pass" required />
        </div>
        <div class="form-group">
          <label for="file">Cover image : </label>
          <input type="file" class="form-control-file" id="file" accept="image/*" />
        </div>
        <button type="button" class="btn btn-primary" onclick="writeIMG()">Embed Message</button>
      </div>
    </div>
    `);
  });

  $(".btn-extract").click(function () {
    $(this).addClass("active-button");
    $(".btn-embed").removeClass("active-button");
    $(".btn-test").removeClass("active-button");
    $(".nav-extract").addClass("active");
    $(".nav-embed").removeClass("active");
    $(".nav-test").removeClass("active");
    $(".content").html(`
    <div class="row justify-content-center">
    <div class="col-10 mt-4">
      <div class="form-group">
        <label for="file1">Cover image:</label>
        <input type="file" class="form-control-file" id="file1" />
      </div>
      <div class="form-group">
        <label for="shift">Shift:</label>
        <input type="number" class="form-control" id="shift1" required />
      </div>
      <div class="form-group">
        <label for="pass1">Key:</label>
        <input type="text" class="form-control" id="pass1" required />
      </div>
      <button type="button" class="btn btn-primary" onclick="readIMG()">Extract Message</button>
     
      <textarea
              class="form-control alert-primary"
              rows="3"
              id="result"
              required
            ></textarea>
          </div>
      
      
    </div>
  </div>
        `);
  });

  $(".btn-test").click(function () {
    $(this).addClass("active-button");
    $(".btn-embed").removeClass("active-button");
    $(".btn-extract").removeClass("active-button");
    $(".nav-test").addClass("active");
    $(".nav-embed").removeClass("active");
    $(".nav-extract").removeClass("active");
    $(".content").html(`
        <div class="row justify-content-center">
        <div class="col-10 mt-4 card mx-auto">
          <div class="form-group">
            <label for="gambar">Original image : </label>
            <input type="file" class="form-control-file" id="objFile" accept="image/*" id="" onchange="uploadFile()"/>
          </div>
          <div class="form-group">
            <label for="gambar">Stegano image : </label>
            <input type="file" class="form-control-file" id="file1" accept="image/*" id="" onchange="stegoFile()"/>
          </div>
          
          
          
          <button type="button" class="btn btn-primary" onclick='getPSNR()'>Submit</button>
          <pre id="result" class="alert alert-primary"></pre>
        </div>
      </div>
        `);
  });
});
