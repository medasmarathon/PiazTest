import { CreateLinkRequest } from '../dto/createLinkRequest';
import { UpdateLinkRequest } from '../dto/updateLinkRequest';
import { LinkModel } from '../model/LinkModel';
import { AppDataSource } from '../data-source';
import { ErrorCode, handleError } from '../utils/error';

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
      const existingLink = await linkRepository.findOneBy({ id });
      if (!existingLink) {
        throw new Error('Link not found');
      }

      if (existingLink.userEmail !== userEmail) {
        throw new Error('Unauthorized to update this link');
      }

      const parsed = UpdateLinkRequest.parse(updateLinkRequest);
      return await linkRepository.save({
        ...parsed,
        id,
        userEmail
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Link not found') {
          handleError({
            code: ErrorCode.NOT_FOUND,
            statusCode: 404,
            message: 'Link not found',
            details: { id }
          });
        } else if (error.message === 'Unauthorized to update this link') {
          handleError({
            code: ErrorCode.UNAUTHORIZED,
            statusCode: 401,
            message: 'Unauthorized to update this link',
            details: { id, userEmail }
          });
        }
      }
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
      const link = await linkRepository.findOneBy({ id });
      if (!link) {
        throw new Error('Link not found');
      }
      return link;
    } catch (error) {
      if (error instanceof Error && error.message === 'Link not found') {
        handleError({
          code: ErrorCode.NOT_FOUND,
          statusCode: 404,
          message: 'Link not found',
          details: { id }
        });
      }
      handleError(error);
    }
  }

  async deleteLinkByUrl(url: string) {
    try {
      const linkToRemove = await linkRepository.findOneBy({ url });
      if (!linkToRemove) {
        throw new Error('Link not found');
      }

      await linkRepository.remove(linkToRemove);
      return true;
    } catch (error) {
      if (error instanceof Error && error.message === 'Link not found') {
        handleError({
          code: ErrorCode.NOT_FOUND,
          statusCode: 404,
          message: 'Link not found',
          details: { url }
        });
      }
      handleError(error);
    }
  }
}