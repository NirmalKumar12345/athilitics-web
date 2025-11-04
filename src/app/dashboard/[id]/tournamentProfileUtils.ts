import { Routes } from '@/app/constants/routes';

export async function handleProfileImageUpload(
  tournamentId: number,
  updateData: any,
  updatedProfileImage: File,
  uploadTournamentProfilePicture: (file: File) => Promise<{ key: string }>,
  updateTournament: (id: number, data: any) => Promise<void>,
  resetImageState: () => void,
  router: any,
  toast: any
) {
  const result = await uploadTournamentProfilePicture(updatedProfileImage);
  updateData.tournament_profile = result.key;
  await updateTournament(tournamentId, updateData);
  toast.success('Tournament updated successfully');
  resetImageState();
  sessionStorage.removeItem('tournamentData');
  router.push(Routes.DASHBOARD);
}

export async function handleProfileImageRemoval(
  tournamentId: number,
  updateData: any,
  updateTournament: (id: number, data: any) => Promise<void>,
  resetImageState: () => void,
  router: any,
  toast: any
) {
  updateData.tournament_profile = '';
  await updateTournament(tournamentId, updateData);
  toast.success('Tournament updated successfully! Profile image removed.');
  resetImageState();
  sessionStorage.removeItem('tournamentData');
  router.push(Routes.DASHBOARD);
}

export async function handleProfileImageUnchanged(
  tournamentId: number,
  updateData: any,
  updateTournament: (id: number, data: any) => Promise<void>,
  resetImageState: () => void,
  router: any,
  toast: any
) {
  const { tournament_profile, ...restUpdateData } = updateData;
  await updateTournament(tournamentId, restUpdateData);
  toast.success('Tournament updated successfully!');
  resetImageState();
  sessionStorage.removeItem('tournamentData');
  router.push(Routes.DASHBOARD);
}

export async function processProfileImageUpdate(
  tournamentId: number,
  updateData: any,
  deps: {
    updatedProfileImage: File | null;
    hasProfileImageChanged: boolean;
    uploadTournamentProfilePicture: (file: File) => Promise<{ key: string }>;
    updateTournament: (id: number, data: any) => Promise<void>;
    resetImageState: () => void;
    router: any;
    toast: any;
  }
) {
  const {
    updatedProfileImage,
    hasProfileImageChanged,
    uploadTournamentProfilePicture,
    updateTournament,
    resetImageState,
    router,
    toast,
  } = deps;

  if (updatedProfileImage) {
    if (!uploadTournamentProfilePicture) {
      throw new Error('Profile picture upload service is currently unavailable. Please contact support.');
    }

    await handleProfileImageUpload(
      tournamentId,
      updateData,
      updatedProfileImage,
      uploadTournamentProfilePicture,
      updateTournament,
      resetImageState,
      router,
      toast
    );
  } else if (hasProfileImageChanged && !updatedProfileImage) {
    await handleProfileImageRemoval(
      tournamentId,
      updateData,
      updateTournament,
      resetImageState,
      router,
      toast
    );
  } else {
    await handleProfileImageUnchanged(
      tournamentId,
      updateData,
      updateTournament,
      resetImageState,
      router,
      toast
    );
  }
}
