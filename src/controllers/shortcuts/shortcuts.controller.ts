import { Request, Response } from "express";
import Joi, { ValidationError, ValidationResult } from "joi";
import { ShortcutData } from "../../interfaces";
import ShortcutService from "../../services/shortcuts/shortcut.service";

class ShortcutController {
  private shortcutService;

  constructor () {
    this.shortcutService = new ShortcutService();
  }

  private validateShortcutData = (
    shortcutData: ShortcutData,
  ): ValidationResult => {
    const schema = Joi.object({
      shortlink: Joi.string()
        .trim()
        .required(),
      url: Joi.string()
        .uri()
        .trim()
        .required(),
      visibility: Joi.string()
        .required()
        .allow(["Workspace", "Private"]),
      description: Joi.string()
        .trim()
        .optional(),
      tags: Joi.array().optional(),
    });

    return schema.validate(shortcutData);
  };

  /**
   * @param req Express request
   * @param res Express response
   */
  public addShortcut = (req: Request, res: Response) => {
    let shortcutData: ShortcutData = req.body;
    const shortcutTags: string[] | undefined = shortcutData["tags"];

    /**
     * If tags are not found, add an empty array before validation
     */
    if (!shortcutTags) {
      shortcutData = { ...shortcutData, tags: [] };
    }

    const validationError:
      | ValidationError
      | null
      | undefined = this.validateShortcutData(shortcutData).error;

    if (!validationError) {
      console.log(shortcutData);
    }

    //userId is available in the cookies that are being passed
  };
}

export default ShortcutController;
