import { CreateLinkRequest } from '../dto/createLinkRequest';
import { UpdateLinkRequest } from '../dto/updateLinkRequest';
import { LinkModel } from '../model/LinkModel';
import { AppDataSource } from '../data-source';
import { handleError } from '../utils/error';

const linkRepository = AppDataSource.getRepository(LinkModel);



type CreateLinkInput = typeof CreateLinkRequest._input;
type UpdateLinkInput = typeof UpdateLinkRequest._input;

export class LinksService {

  async createLink(createLinkRequest: CreateLinkInput, userEmail: string) {
    try {
      const parsed = CreateLinkRequest.parse(createLinkRequest);
      const existedLink = await linkRepository.findOne({
        where: { url: parsed.url }
      });

      return await linkRepository.save({
        ...parsed,
        id: existedLink ? existedLink.id : undefined,
        created_at: parsed.created_at ? new Date(parsed.created_at).toUTCString() : new Date().toUTCString(),
        userEmail
      });
    } catch (error) {
      handleError(error);
    }
  }

  async updateLink(id: string, updateLinkRequest: UpdateLinkInput, userEmail: string) {
    try {
      const parsed = UpdateLinkRequest.parse(updateLinkRequest);
      return await linkRepository.save({
        ...parsed,
        id,
        userEmail
      });
    } catch (error) {
      handleError(error);
    }
  }

  async getLinksForUser(userEmail: string) {
    try {
      if (!userEmail) return [];

      return await linkRepository.find({
        where: { userEmail },
        order: { created_at: "desc" }
      });
    } catch (error) {
      handleError(error);
    }
  }

  async getLinkById(id: string) {
    try {
      return await linkRepository.findOneBy({ id });
    } catch (error) {
      handleError(error);
    }
  }

  async deleteLinkByUrl(url: string) {
    try {
      const linkToRemove = await linkRepository.findOneBy({ url });
      if (!linkToRemove) return null;

      await linkRepository.remove(linkToRemove);
      return true;
    } catch (error) {
      handleError(error);
    }
  }
}