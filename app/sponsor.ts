export interface SponsorItem {
  name: string
  avatar: string | null
  date: string
  amount: string
}

export interface SponsorConfig {
  sponsors: SponsorItem[]
}

export const sponsorData: SponsorConfig = {
  sponsors: [
    {
      name: 'example',
      avatar: null,
      date: '2025-12-10',
      amount: '100 ￥',
    },
  ],
}

export default sponsorData
