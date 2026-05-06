package plp.web;

import org.teavm.jso.JSBody;

public abstract class PlpResultImpl implements PlpResult {

  @JSBody(params = {"success", "output", "message"}, script =
      "return { success: success, output: output, message: message };")
  public static native PlpResult create(boolean success, String output, String message);
}
