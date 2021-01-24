import { CountryCodesEnum } from '@/services/TravelSafe/countryCodes.enum';

export interface RestrictionInterface {
  origin: {
    name: string;
    type: 'country';
    country_code: CountryCodesEnum;
  };
  destination: {
    name: string;
    type: 'country';
    country_code: CountryCodesEnum;
  };
  authorization_status: 'restricted' | 'unknown' | 'allowed' | 'forbidden';
  summary: string;
  details: string;
  start_date: string;
  end_date: string;
  updated_at: string;
  requirements: {
    category: {
      id: 'quarantine' | 'test_medical_certificate' | 'other_medical_measures' | 'other_restrictions' | 'additional_documentation';
      name: string;
    };
    sub_category: {
      id: string;
      name: string;
    };
    summary: string;
    details: string;
    start_date: string;
    end_date: string;
    documents: [
      {
        name: string;
        document_url: string;
        download_url: string;
      }
    ];
  }[];
  info_source: {
    name: string;
    url: string;
  };
}
